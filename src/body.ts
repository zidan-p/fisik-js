import { Controller } from "./controller";
import { Drawer } from "./drawer";
import { Circle } from "./shapes/circle";
import { Line } from "./shapes/line";
import { Rectangle } from "./shapes/rectangle";
import { Shape } from "./shapes/shape.interface";
import { Vector } from "./vector";





export abstract class Body {

  protected controller?: Controller;

  protected _angle: number;

  abstract components: (Rectangle | Circle | Line)[];

  // protected _edge: Vector;
  // protected _length: number;
  // protected _width: number;
  // protected _refDirection: Vector;

  protected _position: Vector

  protected _angleVelocity: number = 0;
  protected _angleFriction?: number;
  protected _angleAcceleration?: number;
  protected _angleAccelerationIncrement?: number;

  protected _velocity = new Vector(0,0);
  protected _acceleration = new Vector(0,0);
  protected _accelerationIncrement = 1;
  protected _friction = 0.1
  protected _mass: number = 10;
  protected _inverseMass!: number;
  protected _inertia!: number;
  protected _inverseInertia!: number;
  protected _elasticity = 0.5;

  public static lineHelper = new Vector(550, 400);

  public directionMovement = {
    up: false,
    down: false,
    right: false,
    left: false
  }

  constructor(position: Vector, angle: number, mass: number, controller?: Controller){
    this._position = position
    this._angle = angle;
    this.mass = mass;
    this.controller = controller;
    this.registerController();
  }

  public get acceleration(){return this._acceleration}
  public set acceleration(a: Vector){this._acceleration = a}

  public get position (){return this._position}
  public set position(pos: Vector) {this._position = pos};

  public set elasticity(n: number) {this._elasticity = n}
  public get elasticity(){return this._elasticity}

  public get velocity(){return this._velocity}
  public set velocity(v: Vector){this._velocity = v}


  public get angleVelocity(){return this._angleVelocity}
  public set angleVelocity(n: number){this._angleVelocity = n}

  public set inverseMass(n: number){this._inverseMass = n}
  public get inverseMass(){return this._inverseMass}
  public setDefaultInverseMass(){
    console.log(this.mass);
    this.mass === 0 ? this._inverseMass = 0 : this._inverseMass = 1 / this._mass;
  }
  

  /** default using mass value */
  public set inertia(inert: number){this._inertia = inert;}
  public setDefaultInertia(){
    // this._inertia = this._mass * (this._width**2 + (this._length + 2 * this._width)**2 ) / 12;
    this._inertia = this._mass * (0**2 + (0 + 2 * 0)**2 ) / 12;
  }
  public get inertia(){return this._inertia}

  public get inverseInertia(){return this._inverseInertia}
  public set inverseInertia(n: number){this._inverseInertia = n}
  public setDefaultInverseInertia(){
    if(this.mass === 0){
      this._inverseInertia = 0;
    } else {
      this._inverseInertia = 1 / this._inertia;
    }
  }

  public set mass(n: number){
    this._mass = n;
    
    this.setDefaultInverseMass();
    this.setDefaultInertia(); //it must first before inverse innertia
    this.setDefaultInverseInertia();
  }
  public get mass(){return this._mass}
  public getMass(){return this._mass};


  protected registerController(){
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

  abstract keyControl(): void

  abstract reposition(): void;

  move(){
    this.keyControl();
    this.reposition();
  }

  abstract draw(): void
}