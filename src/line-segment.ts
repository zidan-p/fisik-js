import { Vector } from "./vector";


export interface LineSegmentLike{
  start: Vector;
  end: Vector;
  direction: Vector
}

export class LineSegment {


  // line segment of closest point of certain position with capsule line
  static colsestPointPositionToLineSegment(position: Vector, wallLike: LineSegmentLike){
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
}