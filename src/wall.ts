import { Ball } from "./ball";
import { Controller } from "./controller";
import { Drawer } from "./drawer";
import { LineSegment } from "./line-segment";
import { Matrix } from "./matrix";
import { Shape } from "./shapes/shape.interface";
import { Vector } from "./vector";
import { Line } from "./shapes/line";


export class Wall implements LineSegment{

  private _components: Shape[];

  public directionMovement = {
    up: false,
    down: false,
    right: false,
    left: false
  }

  public direction: Vector;
  public vertex: Vector[];
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
    this.direction = this.end.subtr(this.start).unit();
    this.vertex = [this.start, this.end]

    this.refStart = this.start.newInstance();
    this.refEnd = this.end.newInstance();
    this.refUnit = this.end.subtr(this.start).unit();

    this._components = [new Line(start, end, {drawer})];

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

    this.controller.onDown(() => this.directionMovement.down = true);
    this.controller.onUp(() => this.directionMovement.up = true);
    this.controller.onRight(() => this.directionMovement.right = true);
    this.controller.onLeft(() => this.directionMovement.left = true);

    this.controller.onReleaseDown(() => this.directionMovement.down = false);
    this.controller.onReleaseUp(() => this.directionMovement.up = false);
    this.controller.onReleaseRight(() => this.directionMovement.right = false);
    this.controller.onReleaseLeft(() => this.directionMovement.left = false);
  }

  private keyControl(){
    if(this.directionMovement.left) this.angleVelocity -= 0.05;
    if(this.directionMovement.right) this.angleVelocity += 0.05;
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
    this._components[0].draw();
    // const rotationMatrix = Matrix.rotationMatrix(this.angle);
    // const newDirection = this.refUnit.multMatrix(rotationMatrix);
    // this.start = this.center.add(newDirection.mult(-this.length / 2));
    // this.end = this.center.add(newDirection.mult(this.length / 2));
    // this.drawer.drawLine(
    //   this.start.x, 
    //   this.start.y,
    //   this.end.x,
    //   this.end.y,
    //   this._color
    // )
  }

  static closestPosintBallandWall(ball: Ball, wall: Wall){
    return LineSegment.closestPointPositionToLineSegment(ball.getPosition(), wall)
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