import { Controller } from "./controller";
import { Drawer } from "./drawer";
import { LineSegment, LineSegmentLike } from "./line-segment";
import { Matrix } from "./matrix";
import {Vector} from "./vector"

export class Capsule implements LineSegmentLike{

  private _start: Vector
  private _end: Vector;
  private _rad: number;
  private _refDirection: Vector;
  private _refAngle: number;
  private _angle: number;
  private _position: Vector;
  private _length:number;
  private _direction: Vector;

  private _angleVelocity: number;
  private _velocity = new Vector(0,0);
  private _acceleration = new Vector(0,0);
  private _accelerationIncrement = 1;
  private _friction = 0.1
  // private _mass: number = 10;
  // private _elasticity = 0.5;

  public directionMovement = {
    up: false,
    down: false,
    right: false,
    left: false
  }


  private _drawer: Drawer;
  private _controller?: Controller


  constructor(start: Vector,end: Vector,rad: number, drawer: Drawer, controller?: Controller){
    this._start = start;
    this._end = end;
    this._rad = rad;
    this._position = this._start.add(this._end).mult(0.5);
    this._length = this._end.subtr(this._start).mag();

    this._angle = 0;
    this._angleVelocity = 0;
    this._direction = this._end.subtr(this._start).unit();
    this._refDirection = this._end.subtr(this._start).unit();
    
    this._refAngle = Math.acos(Vector.dot(this._end.subtr(this._start).unit(), new Vector(1,0)));

    if(Vector.cross(this._refDirection, new Vector(1,0)) > 0) {
      this._refAngle *= -1;
    }

    this._controller = controller;
    this._drawer = drawer

    this.registerController()
  }

  public get start(){ return this._start}
  public set start(s: Vector){ this.start = s}

  public get end(){return this._end}
  public set end(e: Vector){this._end = e}

  public get radius(){return this._rad}
  public set radius(r: number){this._rad = r}

  public get direction(){return this._direction}
  public set direction(d: Vector){this._direction = d}

  registerController(){
    console.log("registering controller");
    if(!this._controller) {
      console.log("controller not defined");
      return;
    }

    this._controller.onDown(() => this.directionMovement.down = true);
    this._controller.onUp(() => this.directionMovement.up = true);
    this._controller.onRight(() => this.directionMovement.right = true);
    this._controller.onLeft(() => this.directionMovement.left = true);

    this._controller.onReleaseDown(() => this.directionMovement.down = false);
    this._controller.onReleaseUp(() => this.directionMovement.up = false);
    this._controller.onReleaseRight(() => this.directionMovement.right = false);
    this._controller.onReleaseLeft(() => this.directionMovement.left = false);
  }

  keyControl(){
    if(this.directionMovement.up){
      this._acceleration = this._direction.mult(-this._accelerationIncrement);
    }
    if(this.directionMovement.down){ 
      this._acceleration = this._direction.mult(this._accelerationIncrement);
    }
    // if(this.directionMovement.left) this._acceleration.x = -this._accelerationIncrement;
    // if(this.directionMovement.right) this._acceleration.x = this._accelerationIncrement;

    if(this.directionMovement.left) this._angleVelocity -= 0.005;
    if(this.directionMovement.right) this._angleVelocity += 0.005;

    if(!this.directionMovement.up && !this.directionMovement.down){
      this._acceleration = new Vector(0,0)
    }
  }

  reposition(){
    this._acceleration = this._acceleration.unit().mult(this._accelerationIncrement);
    this._velocity = this._velocity.add(this._acceleration);
    this._velocity = this._velocity.mult(1 - this._friction);
    this._position = this._position.add(this._velocity);

    this._angle += this._angleVelocity;
    this._angleVelocity *= 0.96;

    const rotationMat = Matrix.rotationMatrix(this._angle);
    this._direction = this._refDirection.multMatrix(rotationMat);

    this._start = this._position.add(this._direction.mult(- this._length / 2));
    this._end = this._position.add(this._direction.mult(this._length / 2));
  }

  // line segment of closest point of certain position with capsule line
  static closestPointPositionToCapsuleLine(position: Vector, capsule: Capsule){
    return LineSegment.colsestPointPositionToLineSegment(position, capsule);
  }

  closestPointPositionToCapsuleLine(position: Vector){
    return Capsule.closestPointPositionToCapsuleLine(position, this);
  }


  move(){
    this.keyControl();
    this.reposition();
  }

  draw(){
    this._drawer.drawCapsule(
      this._start.x,
      this._start.y,
      this._end.x,
      this._end.y,
      this._rad,
      this._angle,
      this._refAngle,
      "none"
    )

    this._drawer.drawLine(
      this._start.x,
      this._start.y,
      this._end.x,
      this._end.y,
    )
  }

}