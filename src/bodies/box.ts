import { Controller } from "../controller";
import { Drawer } from "../drawer";
import { LineSegment } from "../line-segment";
import { Matrix } from "../matrix";
import { Shape } from "../shapes/shape.interface";
import { Vector } from "../vector";
import {Rectangle} from "../shapes/rectangle";
import { DrawOption } from "../shapes/draw-option.interface";
import { Body } from "../body";




export class Box extends Body {

  private _components: Rectangle[];


  private _drawer: Drawer;
  private _controller?: Controller


  constructor(start: Vector,end: Vector,width: number, mass: number, drawOption: DrawOption, controller?: Controller){

    const edge = end.subtr(start);
    const length = edge.mag();
    const direction = edge.unit();
    const position = start
      .add(direction.mult(length / 2))
      .add(direction.normal().mult(width / 2))

    super(position, 0, mass, controller);
    


    this._controller = controller;
    this._drawer = drawOption.drawer

    this._components = [new Rectangle(start, end, width, drawOption)];

    this.setPhysicsComponent();

    // console.log("inverse inertia box : " + this._inverseInertia);
  }

  public get components(){return this._components}
  public set components(c:Rectangle[] ){this._components = c}

  keyControl(){
    if(this.directionMovement.up){
      this._acceleration = this._components[0].direction.mult(-this._keyForce);
    }
    if(this.directionMovement.down){ 
      this._acceleration = this._components[0].direction.mult(this._keyForce);
    }
    // if(this.directionMovement.left) this._acceleration.x = -this._keyForce;
    // if(this.directionMovement.right) this._acceleration.x = this._keyForce;

    if(this.directionMovement.left) this._angleVelocity -= this._angleKeyForce;
    if(this.directionMovement.right) this._angleVelocity += this._angleKeyForce;

    if(!this.directionMovement.up && !this.directionMovement.down){
      this._acceleration = new Vector(0,0)
    }
  }

  setPosition(position: Vector, angle?: number): void {
    this.position = position;
    this._components[0].position = position;
    // this._components[0].angle ;
  
    this._components[0].getVertices(Number(angle) + this._angle);
  }

  reposition(){
    super.reposition();
    this.setPosition(this.position, this._angle);
  }


  move(){
    this.keyControl();
    this.reposition();
  }

  render(){
    super.render();
    // this._drawer.drawRectangle(this._vertex, "none", "black");
    // this._drawer.drawCircle(this._position.x, this._position.y, 10, undefined, undefined, "none", "red")
  }
}