import { Circle } from "./shapes/circle";
import { Box } from "./box";
import { Drawer } from "./drawer";
import { drawer } from "./main";
import { Vector } from "./vector";
import { Rectangle } from "./shapes/rectangle";
import { Line } from "./shapes/line";
import { Triangle } from "./shapes/triangle";

export interface Projection {
  min: number;
  max: number;
  collisionVertex: Vector;
}

export interface VertexContainer {
  vertex: Vector[]
}

export interface SATResult{
  penetration: number | null;
  axis: Vector;
  vertex: Vector;
}

export abstract class LineSegment {

  abstract start: Vector;
  abstract end: Vector;
  abstract direction: Vector
  abstract vertex: Vector[];



  // -------------------------------------------------------------

  static closestPointPositionToLineSegment(position: Vector, wallLike: LineSegment){
    let ballToWallStart = wallLike.start.subtr(position)
    if(Vector.dot(wallLike.direction, ballToWallStart) > 0){
      return wallLike.start;
    }

    let ballToWallEnd = position.subtr(wallLike.end)
    if(Vector.dot(wallLike.direction, ballToWallEnd) > 0){
      return wallLike.end;
    }

    let closestDistance = Vector.dot(wallLike.direction, ballToWallStart);
    let closestVector = wallLike.direction.mult(closestDistance);
    return wallLike.start.subtr(closestVector);
  }


  static closestPointBetweenLineSegemnt(ls1: LineSegment, ls2: LineSegment){
    let shortestDistance = LineSegment.closestPointPositionToLineSegment(ls1.start, ls2)
      .subtr(ls1.start).mag();
    let closestPoint = [ls1.start, LineSegment.closestPointPositionToLineSegment(ls1.start, ls2)];

    if(LineSegment.closestPointPositionToLineSegment(ls1.end, ls2).subtr(ls1.end).mag() < shortestDistance){
      shortestDistance = LineSegment.closestPointPositionToLineSegment(ls1.end, ls2).subtr(ls1.end).mag();
      closestPoint = [ls1.end, LineSegment.closestPointPositionToLineSegment(ls1.end, ls2)];
    }  

    if(LineSegment.closestPointPositionToLineSegment(ls2.start, ls1).subtr(ls2.start).mag() < shortestDistance){
      shortestDistance = LineSegment.closestPointPositionToLineSegment(ls2.start, ls1).subtr(ls2.start).mag();
      closestPoint = [LineSegment.closestPointPositionToLineSegment(ls2.start, ls1), ls2.start];
    }

    if(LineSegment.closestPointPositionToLineSegment(ls2.end, ls1).subtr(ls2.end).mag() < shortestDistance){
      shortestDistance = LineSegment.closestPointPositionToLineSegment(ls2.end, ls1).subtr(ls2.end).mag();
      closestPoint = [LineSegment.closestPointPositionToLineSegment(ls2.end, ls1), ls2.end];
    }

    return closestPoint;
  }

  static closestVertexToPoint(obj: VertexContainer, p: Vector){
    let closestVertex;
    let minDistance = null;
    for (let i = 0; i < obj.vertex.length; i++) {
      if(p.subtr(obj.vertex[i]).mag() < Number(minDistance) || minDistance === null){
        closestVertex = obj.vertex[i];
        minDistance = p.subtr(obj.vertex[i]).mag();
      }
    }
    return closestVertex;
  }

   


  static getFirstShape(obj: unknown){
    if(obj instanceof Circle || obj instanceof Line) return 1;
    if(obj instanceof  Rectangle) return 2;

    throw new Error("Unknow Shape");
  }

  //the Circle vertices always need to be recalculated based on the current projection axis direction
  static setBallVerticesAlongAxis(obj: unknown, axis: Vector){
    if(obj instanceof Circle){
      obj.vertex[0] = obj.position.add(axis.unit().mult(-obj.radius));
      obj.vertex[1] = obj.position.add(axis.unit().mult(obj.radius));

    }
  }



  static findAxes(ob1: Circle | Line | Rectangle | Triangle, ob2: Circle | Line | Rectangle | Triangle){
    const axes: Vector[] = [];

    if(ob1 instanceof Circle && ob2 instanceof Circle){
      axes.push(ob2.position.subtr(ob1.position).unit());
      return axes;
    }

    if(ob1 instanceof Circle){
      axes.push(
        LineSegment
        .closestVertexToPoint(ob2 as Line, ob1.position)!
        .subtr(ob1.position)
        .unit()
      )
      axes.push((ob2 as Line).direction.normal());
      if(ob2 instanceof Rectangle) axes.push(ob2.direction);

      return axes;
    }

    if(ob2 instanceof Circle){
      axes.push(ob1.direction.normal());
      if(ob1 instanceof Rectangle) axes.push(ob1.direction);
      axes.push(
        LineSegment.closestVertexToPoint(ob1, ob2.position)!
          .subtr(ob2.position)
          .unit()
      )

      return axes;
    }
 
    axes.push(ob1.direction.normal());
    if(ob1 instanceof Rectangle){
      axes.push(ob1.direction);
    }
    axes.push(ob2.direction.normal());
    if(ob2 instanceof Rectangle){
      axes.push(ob2.direction);
    }
    return axes;
  }

  static projectionOntoAxis(axis: Vector, object: VertexContainer): Projection{
    if(!object?.vertex) throw new Error("object + " + object?.constructor.name + " doesn't has the vertex" );

    LineSegment.setBallVerticesAlongAxis(object, axis);
    let min = Vector.dot(axis, object.vertex[0]);
    let max = min;

    let collisionVertex = object.vertex[0]; 

    for (let i = 0; i < object.vertex.length; i++) {
      let p = Vector.dot(axis, object.vertex[i]);
      if(p < min) {
        min = p;
        collisionVertex = object.vertex[i];
      }
      if(p > max) max = p;
    }

    return {min, max, collisionVertex}
  }

  /**
   * Separating axis theorem
   * @param o1 
   * @param o2 
   */
  static sat(o1: Line | Circle | Rectangle | Triangle, o2: Circle | Line | Rectangle | Triangle): SATResult | false{
    let minOverlap: null | number = null;
    let smallestAxis: Vector;
    let vertexObject : VertexContainer;

    const axes = LineSegment.findAxes(o1, o2);

    let projection1: Projection;
    let projection2: Projection;
    let firstShape = LineSegment.getFirstShape(o1);
    
    
    for (let index = 0; index < axes.length; index++) {
      let overlap: number;
      projection1 = LineSegment.projectionOntoAxis(axes[index], o1);
      projection2 = LineSegment.projectionOntoAxis(axes[index], o2);
      overlap = Math.min(projection1.max, projection2.max) - Math.max(projection1.min, projection2.min);
      if(overlap < 0) return false;

      if(
        (projection1.max > projection2.max && projection1.min < projection2.min) ||
        (projection1.max < projection2.max && projection1.min > projection2.min)
      ){
        const mins = Math.abs(projection1.min - projection2.min);
        const maxs = Math.abs(projection1.max - projection2.max);
        if(mins < maxs){
          overlap += mins;
        } else {
          overlap += maxs;
          axes[index] = axes[index].mult(-1);
        }
      }

      // number of null is 0
      if(overlap < Number(minOverlap) || minOverlap === null){
        minOverlap = overlap;
        smallestAxis = axes[index];
        
        if(index < firstShape){
          vertexObject = o2;
          if(projection1.max > projection2.max) smallestAxis = axes[index].mult(-1);
        }else{
          vertexObject = o1;
          if(projection1.max < projection2.max) smallestAxis = axes[index].mult(-1);
        }
      }
    }


    // beware !!!
    const contactVertex = LineSegment.projectionOntoAxis(smallestAxis!, vertexObject!).collisionVertex;
    // smallestAxis!.drawViewLineToThisVector(contactVertex, minOverlap!, drawer ,"blue"); 

    if((vertexObject!) === o2){
      // console.log("smallest axis before: " + smallestAxis!.toString());
      smallestAxis = smallestAxis!.mult(-1);
      // console.log("smallest axis after : " + smallestAxis!.toString());
    }

    return { 
      axis: smallestAxis!,
      penetration: minOverlap,
      vertex: contactVertex
    }
  }

  

  static previewClosesPoint(drawer: Drawer, ls1: LineSegment, ls2: LineSegment){
    const closestPoints = LineSegment.closestPointBetweenLineSegemnt(ls1, ls2);

    drawer.drawLine(
      closestPoints[0].x, 
      closestPoints[0].y, 
      closestPoints[1].x, 
      closestPoints[1].y,
      "red"
    );

    drawer.drawCircle(
      closestPoints[0].x, 
      closestPoints[0].y,
      30, undefined, undefined, "none", "red"
    )

    drawer.drawCircle(
      closestPoints[1].x, 
      closestPoints[1].y,
      30, undefined, undefined, "none", "red"
    )
  }
}