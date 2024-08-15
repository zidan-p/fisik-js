import { Controller } from "./controller";
import { Drawer } from "./drawer";
import { Circle } from "./shapes/circle";
import { Line } from "./shapes/line";
import { Rectangle } from "./shapes/rectangle";
import { Shape } from "./shapes/shape.interface";
import { Triangle } from "./shapes/triangle";
import { Vector } from "./vector";





export abstract class Body {

  protected controller?: Controller;

  protected _angle: number;

  abstract components: (Rectangle | Circle | Line | Triangle)[];

  // protected _edge: Vector;
  // protected _length: number;
  // protected _width: number;
  // protected _refDirection: Vector;

  protected _position: Vector

  protected _angleVelocity: number = 0;
  protected _angleFriction: number = 0.05;
  protected _angleKeyForce: number = 0.015;
  protected _angleKeyForceIncrement?: number;

  protected _maxSpeed: number = 0;

  protected _velocity = new Vector(0,0);
  protected _acceleration = new Vector(0,0);
  protected _keyForce = 1;
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
    left: false,
    action: false
  }

  // collide body when two of them have saem layer.
  // exception for layer zero, it should collide with everithing
  protected _layer: number = 0;

  constructor(position: Vector, angle: number, mass: number, controller?: Controller){
    this._position = position
    this._angle = angle;
    this._mass = mass;
    this.controller = controller;
    this.registerController();
  }
  
  public get layer(){return this._layer}
  public set layer(l: number){this._layer = l }

  public get acceleration(){return this._acceleration}
  public set acceleration(a: Vector){this._acceleration = a}

  public get position (){return this._position}
  public set position(pos: Vector) {this._position = pos};

  public set elasticity(n: number) {this._elasticity = n}
  public get elasticity(){return this._elasticity}

  public get velocity(){return this._velocity}
  public set velocity(v: Vector){this._velocity = v}

  public get friction(){return this._friction}
  public set friction(f: number){this._friction = f}

  public get angleVelocity(){return this._angleVelocity}
  public set angleVelocity(n: number){this._angleVelocity = n}

  public get maxSpeed(){return this._maxSpeed}
  public set maxSpeed(m: number){this._maxSpeed = m}

  public set inverseMass(n: number){this._inverseMass = n}
  public get inverseMass(){return this._inverseMass}
  public setDefaultInverseMass(){
    console.log("this mass : " + this.mass);
    this._mass === 0 ? this._inverseMass = 0 : this._inverseMass = 1 / this._mass;
  }
  

  /** default using mass value */
  public set inertia(inert: number){this._inertia = inert;}
  public setDefaultInertia(){

    // @ts-ignore
    if(Boolean(this.components[0]?.width as number) && this.components[0]?.length){
      // @ts-ignore
      this._inertia = this._mass * (this.components[0].width**2 + (this.components[0].length + 2 * this.components[0].width)**2 ) / 12;
      return;
    }
    this._inertia = this._mass * (0**2 + (0 + 2 * 0)**2 ) / 12;
  }
  public get inertia(){return this._inertia}

  public get inverseInertia(){return this._inverseInertia}
  public set inverseInertia(n: number){this._inverseInertia = n}
  public setDefaultInverseInertia(){
    if(this._mass === 0){
      this._inverseInertia = 0;
    }else if(this._inertia === 0){
      this._inverseInertia = 0;
    } else {
      this._inverseInertia = 1 / this._inertia;
    }
  }

  public setPhysicsComponent(){
    this.setDefaultInverseMass();
    this.setDefaultInertia(); //it must first before inverse innertia
    this.setDefaultInverseInertia();
  } 

  public set mass(n: number){
    this._mass = n;
    this.setPhysicsComponent();
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
    this.controller.onSpace(() => this.directionMovement.action = true);

    this.controller.onReleaseDown(() => this.directionMovement.down = false);
    this.controller.onReleaseUp(() => this.directionMovement.up = false);
    this.controller.onReleaseRight(() => this.directionMovement.right = false);
    this.controller.onReleaseLeft(() => this.directionMovement.left = false);
    this.controller.onReleaseSpace(() => this.directionMovement.action = false);
  }

  abstract keyControl(): void

  abstract setPosition (position: Vector, angle?: number):void;

  reposition(){
    this._acceleration = this._acceleration.unit().mult(this._keyForce);
    this._velocity = this._velocity.add(this._acceleration);
    this._velocity = this._velocity.mult(1 - this._friction);
    this._angleVelocity *= (1 - this._angleFriction);
    
    if(this._velocity.mag() > this._maxSpeed && this._maxSpeed !== 0){
      this._velocity = this.velocity.unit().mult(this._maxSpeed);
    }
    
    // this._position = this._position.add(this._velocity);
    // this._angle += this._angleVelocity;
  };

  move(){
    this.keyControl();
    this.reposition();
  }

  render(){
    if(!this.components.length){
      console.warn("no component for : " + this.constructor.name);
      return;
    }

    this.components.forEach(c => c.render());
  } 
}