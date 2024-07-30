import { Ball } from "./ball";
import { Drawer } from "./drawer";
import { Vector } from "./vector";



export class Wall {


  constructor(
    public start: Vector,
    public end: Vector,
    private drawer: Drawer
  ){
  }

  get startPosition(){return this.start}
  set startPosition(pos: Vector){this.start = pos}

  get endPosition(){return this.end}
  set endPosition(pos: Vector){this.end = pos}

  wallUnit(){return this.end.subtr(this.start).unit()}

  draw(){
    this.drawer.drawLine(
      this.start.x, 
      this.start.y,
      this.end.x,
      this.end.y,
      "black"
    )
  }

  static closestPosintBallandWall(ball: Ball, wall: Wall){
    let ballToWallStart = wall.start.subtr(ball.getPosition())
    if(Vector.dot(wall.wallUnit(), ballToWallStart) > 0){
      return wall.startPosition;
    }

    let ballToWallEnd = ball.getPosition().subtr(wall.endPosition)
    if(Vector.dot(wall.wallUnit(), ballToWallEnd) > 0){
      return wall.endPosition;
    }

    let closestDistance = Vector.dot(wall.wallUnit(), ballToWallStart);
    let closestVector = wall.wallUnit().mult(closestDistance);
    return wall.startPosition.subtr(closestVector);
  }

  closestPosintBallandWall(ball: Ball){
    return Wall.closestPosintBallandWall(ball, this)
  }

  static collisionDetectionBallAndWall(ball: Ball, wall: Wall){
    const ballClosest = Wall.closestPosintBallandWall(ball, wall).subtr(ball.getPosition());
    // console.log("closest ball with wall : " + ballClosest.x + ", " + ballClosest.y);
    // console.log("magnitude ball with wall : " + ballClosest.mag());
    // console.log("radius ball : " + ball.getRadius());
    if(ballClosest.mag() <= ball.getRadius()) return true;
    return false;
  }

  collisionDetectionBallAndWall(ball: Ball){
    return Wall.collisionDetectionBallAndWall(ball, this)
  }

  static penetrationResolutionBallAndWall(ball: Ball, wall: Wall){
    const penetrationVector = ball.getPosition().subtr(Wall.closestPosintBallandWall(ball, wall));
    ball.setPosition(ball.getPosition().add(penetrationVector.unit().mult(ball.getRadius() - penetrationVector.mag())))
  }

  penetrationResolutionBallAndWall(ball: Ball){
    Wall.penetrationResolutionBallAndWall(ball, this);
  }

  static collisionResolutionBallAndWall(ball:Ball, wall: Wall){
    const normal = ball.getPosition().subtr(Wall.closestPosintBallandWall(ball, wall)).unit();
    const separatingVelocity = Vector.dot(ball.getVelocity(), normal);
    const newSeparatinVelcity = -separatingVelocity * ball.getElasticity();
    const vectorSeparatingDifference = separatingVelocity - newSeparatinVelcity;
    ball.setVelocity(ball.getVelocity().add(normal.mult(-vectorSeparatingDifference)));
  }

  collisionResolutionBallAndWall(ball: Ball){
    Wall.collisionResolutionBallAndWall(ball, this);
  }
}