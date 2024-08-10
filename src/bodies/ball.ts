import { Controller } from "../controller";
import { Drawer } from "../drawer";
import { VertexContainer } from "../line-segment";
import { NumberUtils } from "../util";
import { Vector } from "../vector";
import {Shape} from "../shapes/shape.interface";
import { Circle } from "../shapes/circle";
import { Body } from "../body";



export class Ball extends Body implements VertexContainer {
  
  private _components: [Circle];

  private color: string;
  private strokeColor?: string;

  private _vertex: Vector[];

  private drawer: Drawer;
  protected controller?: Controller;

  public static lineHelper = new Vector(550, 400);


  constructor(
    position: Vector, 
    radius: number,
    drawer: Drawer,
    mass: number,
    color?: string,
    strokeColor?: string,
    controller?: Controller,
  ){
    super(position, 0, mass);

    // // this._radius = radius
    this.drawer = drawer;
    this.color = color ?? "#dc2626";
    this.controller = controller;
    this.strokeColor = strokeColor;

    this._vertex = []

    this._components = [new Circle(position, radius, {drawer, fillColor: color, strokeColor})]

  }


  public set vertex(v: Vector[]){this._vertex = v}
  public get vertex(){return this._vertex}

  public get components(){return this._components}
  public set components(c: [Circle]){this._components = c}


  keyControl(){
    if(this.directionMovement.left){
      this.acceleration.x = -this._accelerationIncrement;
    }
    if(this.directionMovement.up){
      this.acceleration.y = -this._accelerationIncrement;
    }
    if(this.directionMovement.right){
      this.acceleration.x = this._accelerationIncrement;
    }
    if(this.directionMovement.down){ 
      this.acceleration.y = this._accelerationIncrement;
    }
    if(!this.directionMovement.left && !this.directionMovement.right){
      this.acceleration.x = 0;
    }
    if(!this.directionMovement.up && !this.directionMovement.down){
      this.acceleration.y = 0;
    }
  }

  reposition(){
    this.acceleration = this.acceleration.unit().mult(this._accelerationIncrement);
    this._velocity = this._velocity.add(this.acceleration);
    this._velocity = this._velocity.mult(1 - this._friction);
    this._components[0].position = this._components[0].position.add(this._velocity);

  }

  move(){
    this.keyControl();
    this.reposition();
  }

  draw(){
    // this.drawer.drawCircle(this._position.x, this._position.y, this._radius, undefined, undefined, this.color, this.strokeColor);

    this._components[0].draw();

    // also draw vector helper
    Vector.drawViewLine(this._components[0].position, this.acceleration, 50, this.drawer, "green");
    Vector.drawViewLine(this._components[0].position, this._velocity, 15, this.drawer, "red");

    // add stat of ball
    this.drawer.fillText("M : " + this._mass, this._components[0].position.x - 10, this._components[0].position.y - 5);
    this.drawer.fillText("E : " + this._elasticity, this._components[0].position.x - 10, this._components[0].position.y + 5);
  }


  static collisionDetectionBetweenBall(ball1: Ball, ball2: Ball){
    throw new Error("collision not initialized")
    // if(ball1.getRadius() + ball2.getRadius() >= ball2.getPosition().subtr(ball1.getPosition()).mag()) return true;
    // return false;
  }

  collisionDetectionBetweenBall(ball: Ball){
    return Ball.collisionDetectionBetweenBall(this, ball)
  }


  static penetrationResolutionBetweenBall(ball1: Ball, ball2: Ball){
    throw new Error("penetration resolution not initialized")
    // const distance = ball1.getPosition().subtr(ball2.getPosition());
    // const penetrationDepth = ball1.getRadius() + ball2.getRadius() - distance.mag();
    // const penetrationResolutionBetweenBall = distance.unit().mult(penetrationDepth / (ball1.getInverseMass() + ball2.getInverseMass()));
    // ball1.setPosition(ball1.getPosition().add(penetrationResolutionBetweenBall.mult(ball1.getInverseMass())));
    // ball2.setPosition(ball2.getPosition().add(penetrationResolutionBetweenBall.mult(-ball2.getInverseMass())));
  }

  penetrationResolutionBetweenBall(ball: Ball){
    Ball.penetrationResolutionBetweenBall(this, ball);
  }

  
  static collisionResolutionBetweenBall(ball1: Ball, ball2: Ball){
    throw new Error("Not defined")
    // const normal = ball1.getPosition().subtr(ball2.getPosition()).unit();
    // const relativeVelocity = ball1._velocity.subtr(ball2._velocity);
    // const separatingVelocity = Vector.dot(relativeVelocity, normal);
    // const newSeparatingVelocity = -separatingVelocity * Math.min(ball2.getElasticity(), ball1.getElasticity()); //elsaticity implementation

    // const separatingVelocityDifference = newSeparatingVelocity - separatingVelocity;
    // const impulse = separatingVelocityDifference / (ball1.getInverseMass() + ball2.getInverseMass());
    // const impulseVelocity = normal.mult(impulse);
    
    // ball1._velocity = ball1._velocity.add(impulseVelocity.mult(ball1.getInverseMass()));
    // ball2._velocity = ball2._velocity.add(impulseVelocity.mult(-ball2.getInverseMass()));
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

    newObj.elasticity = (NumberUtils.getRandomInt(0,3))

    balls.push(newObj);
  }
  
  return balls;
}