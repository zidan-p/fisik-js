import { Controller } from "../controller";
import { Drawer } from "../drawer";
import { LineSegment } from "../line-segment";
import { Matrix } from "../matrix";
import { Circle } from "../shapes/circle";
import { DrawOption } from "../shapes/draw-option.interface";
import { Rectangle } from "../shapes/rectangle";
import {Vector} from "../vector"
import { Body } from "../body";

export class Capsule extends Body{

  private _componets: [Rectangle, Circle, Circle];


  private _vertex: Vector[];



  private _drawer: Drawer;
  private _controller?: Controller


  constructor(start: Vector,end: Vector,rad: number, mass: number,drawOption: DrawOption, controller?: Controller){
    
    const circle1 = new Circle(start, rad, drawOption);
    const circle2 = new Circle(end, rad, drawOption);

    const recV1 = circle2.position.add(circle2.position.subtr(circle1.position).unit().normal().mult(rad));
    const recV2 = circle1.position.add(circle2.position.subtr(circle1.position).unit().normal().mult(rad));
    const rect = new Rectangle(recV1, recV2, 2 * rad, drawOption);

    // teh superrr --------<<
    super(rect.position, 0, mass, controller);

    this._componets = [rect, circle1, circle2]



    this._vertex = [];  

    this._controller = controller;
    this._drawer = drawOption.drawer

    this.setPhysicsComponent();
    this.registerController()
  }


  public set components(comp: [Rectangle, Circle, Circle]){this._componets = comp}
  public get components(){return this._componets}

  keyControl(){
    if(this.directionMovement.up){
      this._acceleration = this._componets[0].direction.mult(-this._accelerationIncrement);
    }
    if(this.directionMovement.down){ 
      this._acceleration = this._componets[0].direction.mult(this._accelerationIncrement);
    }
    // if(this.directionMovement.left) this._acceleration.x = -this._accelerationIncrement;
    // if(this.directionMovement.right) this._acceleration.x = this._accelerationIncrement;

    if(this.directionMovement.left) this._angleVelocity -= this._angleAcceleration;
    if(this.directionMovement.right) this._angleVelocity += this._angleAcceleration;

    if(!this.directionMovement.up && !this.directionMovement.down){
      this._acceleration = new Vector(0,0)
    }
  }

  reposition(){
    this._acceleration = this._acceleration.unit().mult(this._accelerationIncrement);
    this._velocity = this._velocity.add(this._acceleration);
    this._velocity = this._velocity.mult(1 - this._friction);
    this._componets[0].position = this._componets[0].position.add(this._velocity);

    this._angleVelocity *= 0.96;
    this._componets[0].angle += this._angleVelocity;
    this._componets[0].getVertices();

    this._componets[1].position = this._componets[0].position.add(this._componets[0].direction.mult(-this._componets[0].length/2))
    this._componets[2].position = this._componets[0].position.add(this._componets[0].direction.mult(this._componets[0].length/2))
  }


  move(){
    this.keyControl();
    this.reposition();
  }

  draw(){

    this._componets[0].draw();
    this._componets[1].draw();
    this._componets[2].draw();
  }

}