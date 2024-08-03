import { Controller } from "./controller";
import { Drawer } from "./drawer";
import { LineSegment } from "./line-segment";
import { Matrix } from "./matrix";
import { Vector } from "./vector";





export class Box  {
  private _start: Vector;
  private _end: Vector;
  private _direction: Vector;
  private _vertex: [Vector, Vector, Vector, Vector];
  private _position: Vector;
  private _angle: number;

  private _edge: Vector;
  private _length: number;
  private _width: number;
  private _refDirection: Vector;

  private _angleVelocity: number;
  private _velocity = new Vector(0,0);
  private _acceleration = new Vector(0,0);
  private _accelerationIncrement = 1;
  private _friction = 0.1
  private _mass: number = 10;
  private _inverseMass!: number;
  private _inertia!: number;
  private _inverseInertia!: number;
  private _elasticity = 0.5;

  public directionMovement = {
    up: false,
    down: false,
    right: false,
    left: false
  }


  private _drawer: Drawer;
  private _controller?: Controller


  constructor(start: Vector,end: Vector,width: number, mass: number, drawer: Drawer, controller?: Controller){
    //@ts-ignore
    this._vertex = [];
    this._vertex[0] = start.newInstance();
    this._vertex[1] = end.newInstance();
    this._edge = this._vertex[1].subtr(this._vertex[0]);

    this._width = width;
    this._length = this._edge.mag();
    this._direction = this._edge.unit();
    this._refDirection = this._edge.unit();

    this._start = start;
    this._end = end;

    this._mass = mass;

    this._position = this._vertex[0]
      .add(this._direction.mult(this._length / 2))
      .add(this._direction.normal().mult(this._width / 2))
    
    this._angle = 0;
    this._angleVelocity = 0;
    

    this._vertex[2] = this._vertex[1].add(this._direction.normal().mult(this._width));
    this._vertex[3] = this._vertex[2].add(this._direction.mult(-this._length));

    this._controller = controller;
    this._drawer = drawer

    this.registerController();
  }

  public get position (){return this._position}
  public set position(pos: Vector) {this._position = pos};

  public set elasticity(n: number) {this._elasticity = n}
  public get elasticity(){return this._elasticity}

  public get velocity(){return this._velocity}
  public set velocity(v: Vector){this._velocity = v}

  public get start(){ return this._start}
  public set start(s: Vector){ this.start = s}

  public get angleVelocity(){return this._angleVelocity}
  public set angleVelocity(n: number){this._angleVelocity = n}


  public get end(){return this._end}
  public set end(e: Vector){this._end = e}

  public get width(){return this._width}
  public set width(r: number){this._width = r}

  public get direction(){return this._direction}
  public set direction(d: Vector){this._direction = d}

  public set inverseMass(n: number){this._inverseMass = n}
  public get inverseMass(){return this._inverseMass}
  public setDefaultInverseMass(){
    this.mass === 0 ? this._inverseMass = 0 : this._inverseMass = 1 / this._mass
  }
  

  /** default using mass value */
  public set inertia(inert: number){this._inertia = inert;}
  public setDefaultInertia(){
    this._inertia = this._mass * (this._width**2 + (this._length + 2 * this._width)**2 ) / 12;
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
  public getMass(){return this._mass};


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

    this._vertex[0] = this._position
      .add(this._direction.mult(-this._length / 2))
      .add(this._direction.normal().mult(this._width / 2));

    this._vertex[1] = this._position
      .add(this._direction.mult(-this._length / 2))
      .add(this._direction.normal().mult(-this._width / 2));

    this._vertex[2] = this._position
      .add(this._direction.mult(this._length / 2))
      .add(this._direction.normal().mult(-this._width / 2));

    this._vertex[3] = this._position
      .add(this._direction.mult(this._length / 2))
      .add(this._direction.normal().mult(this._width / 2));
  }


  move(){
    this.keyControl();
    this.reposition();
  }

  draw(){
    this._drawer.drawRectangle(this._vertex, "none", "black");
    this._drawer.drawCircle(this._position.x, this._position.y, 10, undefined, undefined, "none", "red")
  }
}