import { Body } from "../body";
import { Controller } from "../controller";
import { Drawer } from "../drawer";
import { LineSegment } from "../line-segment";
import { Line } from "../shapes/line";
import { Vector } from "../vector";
import { Ball } from "./ball";


export class Wall extends Body implements LineSegment{

  private _components: [Line];

  public directionMovement = {
    up: false,
    down: false,
    right: false,
    left: false
  }

  private  _direction: Vector;
  private _vertex: Vector[];

  private _start: Vector;
  private _end: Vector;
  private _refStart: Vector;
  private _refEnd: Vector;
  private _refUnit: Vector;
  

  private _color: string = "black";

  constructor(
    start: Vector,
    end: Vector,
    private drawer: Drawer,
    controller?: Controller
  ){
    super(start.add(end).mult(0.5), 0, 0, controller);
    this._start = start;
    this._end = end;
    this._direction = end.subtr(start).unit();
    this._vertex = [this._start, this._end]

    this._refStart = this._start.newInstance();
    this._refEnd = this._end.newInstance();
    this._refUnit = this._end.subtr(this._start).unit();

    this._components = [new Line(start, end, {drawer})];

    this.registerController();
  }

  public get direction(){return this._direction}
  public set direction(d: Vector){this._direction = d}

  public set vertex(v: Vector[]){this._vertex = v}
  public get vertex(){return this._vertex}

  get start(){return this._start}
  set start(pos: Vector){this._start = pos}

  get end(){return this._end}
  set end(pos: Vector){this._end = pos}

  get color(){return this._color}
  set color(c: string){this._color = c}

  set components(c: [Line]){this._components = c}
  get components(){return this._components}

  wallUnit(){return this._end.subtr(this._start).unit()}


  public keyControl(){
    if(this.directionMovement.left) this._angleVelocity -= 0.05;
    if(this.directionMovement.right) this._angleVelocity += 0.05;
  }

  public reposition(){
    this._angle += this._angleVelocity;
    this._angleVelocity *= 0.96;
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
    return LineSegment.closestPointPositionToLineSegment(ball.position, wall)
  }

  closestPosintBallandWall(ball: Ball){
    return Wall.closestPosintBallandWall(ball, this)
  }

  static collisionDetectionBallAndWall(ball: Ball, wall: Wall){
    throw new Error("collisionDetectionBallAndWall not initialize")
    // const ballClosest = Wall.closestPosintBallandWall(ball, wall).subtr(ball.getPosition());
    // if(ballClosest.mag() <= ball.getRadius()) return true;
    // return false;
  }

  collisionDetectionBallAndWall(ball: Ball){
    return Wall.collisionDetectionBallAndWall(ball, this)
  }

  static penetrationResolutionBallAndWall(ball: Ball, wall: Wall){
    throw new Error("penetrationResolutionBallAndWall not initialized")
    // const penetrationVector = ball.getPosition().subtr(Wall.closestPosintBallandWall(ball, wall));
    // ball.setPosition(ball.getPosition().add(penetrationVector.unit().mult(ball.getRadius() - penetrationVector.mag())))
  }

  penetrationResolutionBallAndWall(ball: Ball){
    Wall.penetrationResolutionBallAndWall(ball, this);
  }

  static collisionResolutionBallAndWall(ball:Ball, wall: Wall){
    const normal = ball.position.subtr(Wall.closestPosintBallandWall(ball, wall)).unit();
    const separatingVelocity = Vector.dot(ball.velocity, normal);
    const newSeparatinVelcity = -separatingVelocity * ball.elasticity;
    const vectorSeparatingDifference = separatingVelocity - newSeparatinVelcity;
    ball.velocity = (ball.velocity.add(normal.mult(-vectorSeparatingDifference)));
  }

  collisionResolutionBallAndWall(ball: Ball){
    Wall.collisionResolutionBallAndWall(ball, this);
  }
}