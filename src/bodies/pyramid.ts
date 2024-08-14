import { Controller } from "../controller";
import { Drawer } from "../drawer";
import { DrawOption } from "../shapes/draw-option.interface";
import { Vector } from "../vector";
import {Body} from "../body"
import {Triangle} from "../shapes/triangle";






export class Pyramid extends Body{
  
  private _components: [Triangle];


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

    // const pd1 = center.add(moveUp.mult(-radius));
    // const pd2 = center.add(moveUp.mult(radius / 2)).add(moveUp.normal().mult(-radius * Math.sqrt(3) / 2));
    // const pd3 = center.add(moveUp.mult(radius / 2)).add(moveUp.normal().mult(radius * Math.sqrt(3) / 2));
    // const triangle2 = new Triangle(pd1, pd2, pd3, drawOption);

    this._components = [triangle1];
    this._radius = radius

    this._controller = controller;
    this._drawer = drawOption.drawer

    this.setPhysicsComponent();
    this.registerController()

    console.log("inverse inertial star : " + this._inverseInertia);
  }


  public set components(comp: [Triangle]){this._components = comp}
  public get components(){return this._components}

  public setDefaultInertia(): void {
    this._inertia = this._mass * ((2 * this._radius )**2) / 12;
  }

  keyControl(){
    if(this.directionMovement.up){
      this._acceleration = this._components[0].direction.mult(-this._keyForce);
    }
    if(this.directionMovement.down){ 
      this._acceleration = this._components[0].direction.mult(this._keyForce);
    }

    if(this.directionMovement.left) this._angleVelocity -= this._angleKeyForce;
    if(this.directionMovement.right) this._angleVelocity += this._angleKeyForce;

    if(!this.directionMovement.up && !this.directionMovement.down){
      this._acceleration = new Vector(0,0)
    }
  }

  reposition(){

    super.reposition();

    this._components[0].position = this._position;
    this._components[0].getVertices(this._angle);
  }


  move(){
    this.keyControl();
    this.reposition();
  }

  render(){

    super.render()
    // this._drawer.fillText("M : " + this._mass, this._components[0].position.x - 10, this._components[0].position.y - 5);
    // this._drawer.fillText("E : " + this._elasticity, this._components[0].position.x - 10, this._components[0].position.y + 5);
    // this._drawer.fillText("angle velocity : " + this._angleVelocity , this._components[0].position.x - 10, this._components[0].position.y + 20);
    // this._componets[1].draw();
  }

}