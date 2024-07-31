import { Ball } from "./ball";
import { Controller } from "./controller";
import { Drawer } from "./drawer";
import { Matrix } from "./matrix";
import { Vector } from "./vector";



export class Wall {

  public direction = {
    up: false,
    down: false,
    right: false,
    left: false
  }

  public center: Vector;
  public length: number;
  public angle: number = 0;
  public angleVelocity = 0;
  public refStart: Vector;
  public refEnd: Vector;
  public refUnit: Vector;

  private _color: string = "black";

  constructor(
    public start: Vector,
    public end: Vector,
    private drawer: Drawer,
    private controller?: Controller
  ){

    this.center = this.start.add(this.end).mult(0.5);
    this.length = this.end.subtr(this.start).mag();


    this.refStart = this.start.newInstance();
    this.refEnd = this.end.newInstance();
    this.refUnit = this.end.subtr(this.start).unit();

    this.registerController();
  }

  get startPosition(){return this.start}
  set startPosition(pos: Vector){this.start = pos}

  get endPosition(){return this.end}
  set endPosition(pos: Vector){this.end = pos}

  get color(){return this._color}
  set color(c: string){this._color = c}

  wallUnit(){return this.end.subtr(this.start).unit()}

  private registerController(){
    console.log("registering controller");
    if(!this.controller) {
      console.log("controller not defined");
      return;
    }

    this.controller.onDown(() => this.direction.down = true);
    this.controller.onUp(() => this.direction.up = true);
    this.controller.onRight(() => this.direction.right = true);
    this.controller.onLeft(() => this.direction.left = true);

    this.controller.onReleaseDown(() => this.direction.down = false);
    this.controller.onReleaseUp(() => this.direction.up = false);
    this.controller.onReleaseRight(() => this.direction.right = false);
    this.controller.onReleaseLeft(() => this.direction.left = false);
  }

  private keyControl(){
    if(this.direction.left) this.angleVelocity -= 0.05;
    if(this.direction.right) this.angleVelocity += 0.05;
  }

  private reposition(){
    this.angle += this.angleVelocity;
    this.angleVelocity *= 0.96;
  }

  move(){
    this.keyControl();
    this.reposition();
  }

  draw(){
    const rotationMatrix = Matrix.rotationMatrix(this.angle);
    const newDirection = this.refUnit.multMatrix(rotationMatrix);
    this.start = this.center.add(newDirection.mult(-this.length / 2));
    this.end = this.center.add(newDirection.mult(this.length / 2));
    this.drawer.drawLine(
      this.start.x, 
      this.start.y,
      this.end.x,
      this.end.y,
      this._color
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