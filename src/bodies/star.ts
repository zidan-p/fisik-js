import { Controller } from "../controller";
import { Drawer } from "../drawer";
import { DrawOption } from "../shapes/draw-option.interface";
import { Vector } from "../vector";
import {Body} from "./../body"
import {Triangle} from "./../shapes/triangle";






export class Star extends Body{
  
  private _componets: [Triangle, Triangle];


  private _radius: number;


  private _drawer: Drawer;
  private _controller?: Controller


  constructor(centerPosition: Vector, radius: number, mass: number,drawOption: DrawOption, controller?: Controller){

    const center = centerPosition.newInstance();
    const moveUp = new Vector(0,-1);

    
    // teh superrr --------<<
    super(center, 0, mass, controller);
    
    const p1 = center.add(moveUp.mult(radius));
    const p2 = center.add(moveUp.mult(-radius / 2)).add(moveUp.normal().mult(-radius * Math.sqrt(3) / 2));
    const p3 = center.add(moveUp.mult(-radius / 2)).add(moveUp.normal().mult(radius * Math.sqrt(3) / 2));
    const triangle1 = new Triangle(p1, p2, p3, drawOption);

    const pd1 = center.add(moveUp.mult(-radius));
    const pd2 = center.add(moveUp.mult(radius / 2)).add(moveUp.normal().mult(-radius * Math.sqrt(3) / 2));
    const pd3 = center.add(moveUp.mult(radius / 2)).add(moveUp.normal().mult(radius * Math.sqrt(3) / 2));
    const triangle2 = new Triangle(pd1, pd2, pd3, drawOption);

    this._componets = [triangle1, triangle2];
    this._radius = radius

    this._controller = controller;
    this._drawer = drawOption.drawer

    this.setPhysicsComponent();
    this.registerController()

  }


  public set components(comp: [Triangle, Triangle]){this._componets = comp}
  public get components(){return this._componets}

  public setDefaultInertia(): void {
    this._inertia = this._mass * ((2 * this._radius )**2) / 12;
  }

  keyControl(){
    if(this.directionMovement.up){
      this._acceleration = this._componets[0].direction.mult(-this._accelerationIncrement);
    }
    if(this.directionMovement.down){ 
      this._acceleration = this._componets[0].direction.mult(this._accelerationIncrement);
    }

    if(this.directionMovement.left) this._angleVelocity -= this._angleAcceleration;
    if(this.directionMovement.right) this._angleVelocity += this._angleAcceleration;

    if(!this.directionMovement.up && !this.directionMovement.down){
      this._acceleration = new Vector(0,0)
    }
  }

  reposition(){
    super.reposition();
    this._componets[0].position = this._position;
    this._componets[1].position = this._position;
    this._componets[0].getVertices(this._angle);
    this._componets[1].getVertices(this._angle);
    
  }


  move(){
    this.keyControl();
    this.reposition();
  }

  render(){super.render()}

}