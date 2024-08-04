import { Ball } from "./ball";
import { Box } from "./box";
import { Drawer } from "./drawer";
import { drawer } from "./main";
import { Vector } from "./vector";

export interface Projection {
  min: number;
  max: number;
  collisionVertex: Vector;
}

export interface VertexContainer {
  vertex: Vector[]
}

export abstract class LineSegment {

  abstract start: Vector;
  abstract end: Vector;
  abstract direction: Vector
  abstract vertex: Vector[];

  // line segment of closest point of certain position with capsule line
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

  static findAxes(ls1: LineSegment, ls2: LineSegment){
    const axes: Vector[] = [];

    axes.push(ls1.direction.normal());
    axes.push(ls1.direction);
    axes.push(ls2.direction.normal())
    axes.push(ls2.direction);

    return axes;
  }

  static projectionShapeOntoAxis(axis: Vector, object: LineSegment): Projection{
    if(!object?.vertex) throw new Error("object + " + object?.constructor.name + " doesn't has the vertex" );

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

  static sat(o1: LineSegment, o2: LineSegment){
    let minOverlap: null | number = null;
    let smallestAxis: Vector;
    let vertexObject : LineSegment;

    const axes = LineSegment.findAxes(o1, o2);

    let projection1: Projection;
    let projection2: Projection;
    let overlap: number;

    for (let index = 0; index < axes.length; index++) {
      projection1 = LineSegment.projectionShapeOntoAxis(axes[index], o1);
      projection2 = LineSegment.projectionShapeOntoAxis(axes[index], o2);
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
        
        if(index < 2){
          vertexObject = o2;
          if(projection1.max > projection2.max) smallestAxis = axes[index].mult(-1);
        }else{
          vertexObject = o1;
          if(projection1.max < projection2.max) smallestAxis = axes[index].mult(-1);
        }
      }
    }


    // beware !!!
    const contactVertex = LineSegment.projectionShapeOntoAxis(smallestAxis!, vertexObject!).collisionVertex;
    smallestAxis!.drawViewLineToThisVector(contactVertex, minOverlap!, drawer ,"blue");

    return true;
  }

  // -------------------------------------------------------------

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

   


  static getFirstShapeAxes(obj: unknown){
    if(obj instanceof Ball) return 1
    return 2;
  }

  //the ball vertices always need to be recalculated based on the current projection axis direction
  static setBallVerticesAlongAxis(obj: unknown, axis: Vector){
    if(obj instanceof Ball){
      obj.vertex[0] = obj.getPosition().add(axis.unit().mult(-obj.getRadius()));
      obj.vertex[1] = obj.getPosition().add(axis.unit().mult(obj.getRadius()));

    }
  }



  static findBallOrBoxAxes(ob1: Ball | LineSegment, ob2: Ball | LineSegment){
    const axes: Vector[] = [];

    if(ob1 instanceof Ball && ob2 instanceof Ball){
      axes.push(ob2.position.subtr(ob1.position).unit());
      return axes;
    }

    if(ob1 instanceof Ball){
      axes.push(
        LineSegment
        .closestVertexToPoint(ob2 as LineSegment, ob1.position)!
        .subtr(ob1.position)
        .unit()
      )
      axes.push((ob2 as LineSegment).direction.normal());
      if(ob2 instanceof Box) axes.push(ob2.direction);

      return axes;
    }

    if(ob2 instanceof Ball){
      axes.push(
        LineSegment.closestVertexToPoint(ob1, ob2.position)!
          .subtr(ob2.getPosition())
          .unit()
      )

      axes.push(ob1.direction.normal());
      if(ob1 instanceof Box) axes.push(ob1.direction);
      return axes;
    }
 
    axes.push(ob1.direction.normal());
    axes.push(ob1.direction);
    axes.push(ob2.direction.normal());
    axes.push(ob2.direction);
    return axes;
  }

  static projectionBallOrBoxOntoAxis(axis: Vector, object: VertexContainer): Projection{
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
  static satBoxAndBall(o1: LineSegment | Ball, o2: Ball | LineSegment){
    let minOverlap: null | number = null;
    let smallestAxis: Vector;
    let vertexObject : VertexContainer;

    const axes = LineSegment.findBallOrBoxAxes(o1, o2);

    let projection1: Projection;
    let projection2: Projection;
    let firstShape = LineSegment.getFirstShapeAxes(o1);
    
    
    for (let index = 0; index < axes.length; index++) {
      let overlap: number;
      projection1 = LineSegment.projectionBallOrBoxOntoAxis(axes[index], o1);
      projection2 = LineSegment.projectionBallOrBoxOntoAxis(axes[index], o2);
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
    const contactVertex = LineSegment.projectionBallOrBoxOntoAxis(smallestAxis!, vertexObject!).collisionVertex;
    smallestAxis!.drawViewLineToThisVector(contactVertex, minOverlap!, drawer ,"blue");

    return true;
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