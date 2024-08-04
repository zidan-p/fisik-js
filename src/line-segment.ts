import { Drawer } from "./drawer";
import { drawer } from "./main";
import { Vector } from "./vector";

export interface Projection {
  min: number;
  max: number;
  collisionVertex: Vector;
}

export abstract class LineSegment {

  abstract start: Vector;
  abstract end: Vector;
  abstract direction: Vector
  abstract vertex?: Vector[];

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

  /**
   * Separating axis theorem
   * @param o1 
   * @param o2 
   */
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