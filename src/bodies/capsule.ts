import { Controller } from "../controller";
import { Drawer } from "../drawer";
import { Circle } from "../shapes/circle";
import { DrawOption } from "../shapes/draw-option.interface";
import { Rectangle } from "../shapes/rectangle";
import {Vector} from "../vector"
import { Body } from "../body";

export class Capsule extends Body{

  private _componets: [Rectangle, Circle, Circle];





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

    this._controller = controller;
    this._drawer = drawOption.drawer

    this.setPhysicsComponent();
    this.registerController()
  }


  public set components(comp: [Rectangle, Circle, Circle]){this._componets = comp}
  public get components(){return this._componets}
  

  keyControl(){
    if(this.directionMovement.up){
      this._acceleration = this._componets[0].direction.mult(-this._keyForce);
    }
    if(this.directionMovement.down){ 
      this._acceleration = this._componets[0].direction.mult(this._keyForce);
    }

    if(this.directionMovement.left) this._angleVelocity -= this._angleKeyForce;
    if(this.directionMovement.right) this._angleVelocity += this._angleKeyForce;

    if(!this.directionMovement.up && !this.directionMovement.down){
      this._acceleration = new Vector(0,0)
    }
  }

  setPosition(position: Vector, angle?: number): void {
    this._position = position;
    if(angle) this._angle = angle;
    this._componets[0].position = this._position;

    // this._componets[0].angle = angle;
    this._componets[0].getVertices(Number(angle) + this._angle);
  
    this._componets[1].position = this._componets[0].position.add(this._componets[0].direction.mult(-this._componets[0].length/2))
    this._componets[2].position = this._componets[0].position.add(this._componets[0].direction.mult(this._componets[0].length/2))
    
  }

  reposition(){
    super.reposition();
    this.setPosition(this.position.add(this.velocity), this._angle + this.angleVelocity);
  }


  move(){
    this.keyControl();
    this.reposition();
  }

  render(){super.render()}

}