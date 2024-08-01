import { Drawer } from "./drawer";
import { Vector } from "./vector";


export interface LineSegmentLike{
  start: Vector;
  end: Vector;
  direction: Vector
}

export class LineSegment {


  // line segment of closest point of certain position with capsule line
  static closestPointPositionToLineSegment(position: Vector, wallLike: LineSegmentLike){
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


  static closestPointBetweenLineSegemnt(ls1: LineSegmentLike, ls2: LineSegmentLike){
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

  static previewClosesPoint(drawer: Drawer, ls1: LineSegmentLike, ls2: LineSegmentLike){
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