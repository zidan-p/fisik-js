import { Controller } from "./controller";
import { Drawer } from "./drawer";
import { VertexContainer } from "./line-segment";
import { NumberUtils } from "./util";
import { Vector } from "./vector";
import {Shape} from "./shapes/shape.interface";
import {Circle} from "./shapes/circle";



export class Ball implements VertexContainer {
  
  private _components: Shape[];

  private _position: Vector;
  private _radius: number;
  private color: string;
  private strokeColor?: string;

  private _vertex: Vector[];

  private _velocity = new Vector(0,0);
  private acceleration = new Vector(0,0);
  private _mass: number;
  private _inverseMass!: number;
  private _accelerationIncrement = 1;
  private _friction = 0.1
  private _elasticity = 0.5;
  
  private drawer: Drawer;
  private controller?: Controller;

  public static lineHelper = new Vector(550, 400);

  public direction = {
    up: false,
    down: false,
    right: false,
    left: false
  }



  constructor(
    position: Vector, 
    radius: number,
    drawer: Drawer,
    mass: number,
    color?: string,
    strokeColor?: string,
    controller?: Controller,
  ){
    this._mass = mass ?? 100;
    this._position = position;
    this._radius = radius
    this.drawer = drawer;
    this.color = color ?? "#dc2626";
    this.controller = controller;
    this.strokeColor = strokeColor;

    this._vertex = []

    this._components = [new Circle(position, radius, {drawer})]

    this.setInverseMass(mass);
    if(this.controller) this.registerController();
  }

  public get position (){return this._position}
  public set position(pos: Vector) {this._position = pos};

  public get radius() {return this._radius}
  public set radius(r: number){ this._radius = r}

  public set elascticity(n: number) {this._elasticity = n}
  public get elasticity(){return this._elasticity}

  public get velocity(){return this._velocity}
  public set velocity(v: Vector){this._velocity = v}

  public getPosition (){return this._position}
  public setPosition(pos: Vector) {this._position = pos};

  public getRadius() {return this._radius}
  public setRadius(r: number){ this._radius = r}

  public setElascticity(n: number) {this._elasticity = n}
  public getElasticity(){return this._elasticity}

  public getVelocity(){return this._velocity}
  public setVelocity(v: Vector){this._velocity = v}

  public set vertex(v: Vector[]){this._vertex = v}
  public get vertex(){return this._vertex}

  /** 
   * TODO: find out why should inverse mass should be zero when the mass is zero?
   * is it becasue the zero mass entity is considered static object??
   *  */
  public setInverseMass(n: number){n === 0 ? this._inverseMass = 0 : this._inverseMass = 1 / this._mass}

  public getInverseMass(){return this._inverseMass}

  public setMass(n: number){
    this._mass = n;
    this.setInverseMass(n);
  }
  public getMass(){return this._mass};

  private registerController(){
    console.log("registering controller");
    if(!this.controller) {
      console.log("controller not defined");
      return;
    }

    this.controller.onDown(() => this.direction.down = true);
    this.controller.onUp(() => this.direction.up = true);
    this.controller.onRight(() => this.direction.right = true);
    this.controller.onLeft(() => this.direction.left = true);

    this.controller.onReleaseDown(() => this.direction.down = false);
    this.controller.onReleaseUp(() => this.direction.up = false);
    this.controller.onReleaseRight(() => this.direction.right = false);
    this.controller.onReleaseLeft(() => this.direction.left = false);
  }

  keyControl(){
    if(this.direction.left){
      this.acceleration.x = -this._accelerationIncrement;
    }
    if(this.direction.up){
      this.acceleration.y = -this._accelerationIncrement;
    }
    if(this.direction.right){
      this.acceleration.x = this._accelerationIncrement;
    }
    if(this.direction.down){ 
      this.acceleration.y = this._accelerationIncrement;
    }
    if(!this.direction.left && !this.direction.right){
      this.acceleration.x = 0;
    }
    if(!this.direction.up && !this.direction.down){
      this.acceleration.y = 0;
    }
  }

  reposition(){
    this.acceleration = this.acceleration.unit().mult(this._accelerationIncrement);
    this._velocity = this._velocity.add(this.acceleration);
    this._velocity = this._velocity.mult(1 - this._friction);
    this._position = this._position.add(this._velocity);
  }

  move(){
    this.keyControl();
    this.reposition();
  }

  draw(){
    // this.drawer.drawCircle(this._position.x, this._position.y, this._radius, undefined, undefined, this.color, this.strokeColor);

    this._components[0].draw();

    // also draw vector helper
    Vector.drawViewLine(this._position, this.acceleration, 50, this.drawer, "green");
    Vector.drawViewLine(this._position, this._velocity, 15, this.drawer, "red");

    // add stat of ball
    this.drawer.fillText("M : " + this._mass, this._position.x - 10, this._position.y - 5);
    this.drawer.fillText("E : " + this._elasticity, this._position.x - 10, this._position.y + 5);
  }


  static collisionDetectionBetweenBall(ball1: Ball, ball2: Ball){
    if(ball1.getRadius() + ball2.getRadius() >= ball2.getPosition().subtr(ball1.getPosition()).mag()) return true;
    return false;
  }

  collisionDetectionBetweenBall(ball: Ball){
    return Ball.collisionDetectionBetweenBall(this, ball)
  }


  static penetrationResolutionBetweenBall(ball1: Ball, ball2: Ball){
    const distance = ball1.getPosition().subtr(ball2.getPosition());
    const penetrationDepth = ball1.getRadius() + ball2.getRadius() - distance.mag();
    const penetrationResolutionBetweenBall = distance.unit().mult(penetrationDepth / (ball1.getInverseMass() + ball2.getInverseMass()));
    ball1.setPosition(ball1.getPosition().add(penetrationResolutionBetweenBall.mult(ball1.getInverseMass())));
    ball2.setPosition(ball2.getPosition().add(penetrationResolutionBetweenBall.mult(-ball2.getInverseMass())));
  }

  penetrationResolutionBetweenBall(ball: Ball){
    Ball.penetrationResolutionBetweenBall(this, ball);
  }

  
  static collisionResolutionBetweenBall(ball1: Ball, ball2: Ball){
    const normal = ball1.getPosition().subtr(ball2.getPosition()).unit();
    const relativeVelocity = ball1._velocity.subtr(ball2._velocity);
    const separatingVelocity = Vector.dot(relativeVelocity, normal);
    const newSeparatingVelocity = -separatingVelocity * Math.min(ball2.getElasticity(), ball1.getElasticity()); //elsaticity implementation

    const separatingVelocityDifference = newSeparatingVelocity - separatingVelocity;
    const impulse = separatingVelocityDifference / (ball1.getInverseMass() + ball2.getInverseMass());
    const impulseVelocity = normal.mult(impulse);
    
    ball1._velocity = ball1._velocity.add(impulseVelocity.mult(ball1.getInverseMass()));
    ball2._velocity = ball2._velocity.add(impulseVelocity.mult(-ball2.getInverseMass()));
  }


  collisionResolutionBetweenBall(ball: Ball){
    Ball.collisionResolutionBetweenBall(this, ball);
  }
}



export function generateRandomBall(count: number, canvas: HTMLCanvasElement, drawer: Drawer){
  const balls: Ball[] = [];

  for(let i = 0; i < 3; i ++){
    const newObj = new Ball(
      new Vector(Math.random() * canvas.clientWidth, Math.random() * canvas.clientHeight),
      NumberUtils.getRandomInt(10, 50),
      drawer, 
      NumberUtils.getRandomInt(10, 1000), 
      "#6ee7b7"
    );

    newObj.setElascticity(NumberUtils.getRandomInt(0,3))

    balls.push(newObj);
  }
  
  return balls;
}