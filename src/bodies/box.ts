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
  }

  public get components(){return this._components}
  public set components(c:Rectangle[] ){this._components = c}

  keyControl(){
    if(this.directionMovement.up){
      this._acceleration = this._components[0].direction.mult(-this._accelerationIncrement);
    }
    if(this.directionMovement.down){ 
      this._acceleration = this._components[0].direction.mult(this._accelerationIncrement);
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
    // this._position = this._position.add(this._velocity);
    this._components[0].position = this._components[0].position.add(this._velocity);

    this._angleVelocity *= 0.9; 
    this._components[0].angle += this._angleVelocity;
    // this._angle += this._angleVelocity;

    this._components[0].getVertices();
  }


  move(){
    this.keyControl();
    this.reposition();
  }

  draw(){
    this._components[0].draw()
    // this._drawer.drawRectangle(this._vertex, "none", "black");
    // this._drawer.drawCircle(this._position.x, this._position.y, 10, undefined, undefined, "none", "red")
  }
}