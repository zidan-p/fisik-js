import { Controller } from "./controller";
import { Drawer } from "./drawer";
import { Vector } from "./vector";





export class Ball {
  
  private position: Vector;
  private radius: number;
  private color: string;

  private velocity = new Vector(0,0);
  private acceleration = new Vector(0,0);
  private mass: number;
  private inverseMass!: number;
  private accelerationIncrement = 1;
  private friction = 0.1
  private elasticity = 0.5;
  
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
    controller?: Controller,
  ){
    this.mass = mass ?? 100;
    this.position = position;
    this.radius = radius
    this.drawer = drawer;
    this.color = color ?? "#dc2626";
    this.controller = controller;

    this.setInverseMass(mass);
    if(this.controller) this.registerController();
  }

  public getPosition (){return this.position}
  public setPosition(pos: Vector) {this.position = pos};

  public getRadius() {return this.radius}
  public setRadius(r: number){ this.radius = r}

  public setElascticity(n: number) {this.elasticity = n}
  public getElasticity(){return this.elasticity}


  /** 
   * TODO: find out why should inverse mass should be zero when the mass is zero?
   * is it becasue the zero mass entity is considered static object??
   *  */
  public setInverseMass(n: number){n === 0 ? this.inverseMass = 0 : this.inverseMass = 1 / this.mass}

  public getInverseMass(){return this.inverseMass}

  public setMass(n: number){
    this.mass = n;
    this.setInverseMass(n);
  }
  public getMass(){return this.mass};

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

  move(){
    if(this.direction.left){
      this.acceleration.x = -this.accelerationIncrement;
    }
    if(this.direction.up){
      this.acceleration.y = -this.accelerationIncrement;
    }
    if(this.direction.right){
      this.acceleration.x = this.accelerationIncrement;
    }
    if(this.direction.down){
      this.acceleration.y = this.accelerationIncrement;
    }
    if(!this.direction.left && !this.direction.right){
      this.acceleration.x = 0;
    }
    if(!this.direction.up && !this.direction.down){
      this.acceleration.y = 0;
    }
    
    this.acceleration = this.acceleration.unit().mult(this.accelerationIncrement);
    this.velocity = this.velocity.add(this.acceleration);
    this.velocity = this.velocity.mult(1 - this.friction);
    this.position = this.position.add(this.velocity);
  }

  draw(){
    this.drawer.drawCircle(this.position.x, this.position.y, this.radius, this.color);

    // also draw vector helper
    Vector.drawViewLine(this.position, this.acceleration, 50, this.drawer, "green");
    Vector.drawViewLine(this.position, this.velocity, 15, this.drawer, "red");

    // add stat of ball
    this.drawer.fillText("M : " + this.mass, this.position.x - 10, this.position.y - 5);
    this.drawer.fillText("E : " + this.elasticity, this.position.x - 10, this.position.y + 5);
  }


  static collisionDetection(ball1: Ball, ball2: Ball){
    if(ball1.getRadius() + ball2.getRadius() >= ball2.getPosition().subtr(ball1.getPosition()).mag()) return true;
    return false;
  }

  collisionDetection(ball: Ball){
    return Ball.collisionDetection(this, ball)
  }


  static penetrationResolution(ball1: Ball, ball2: Ball){
    const distance = ball1.getPosition().subtr(ball2.getPosition());
    const penetrationDepth = ball1.getRadius() + ball2.getRadius() - distance.mag();
    const penetrationResolution = distance.unit().mult(penetrationDepth / (ball1.getInverseMass() + ball2.getInverseMass()));
    ball1.setPosition(ball1.getPosition().add(penetrationResolution.mult(ball1.getInverseMass())));
    ball2.setPosition(ball2.getPosition().add(penetrationResolution.mult(-ball2.getInverseMass())));
  }

  penetrationResolution(ball: Ball){
    Ball.penetrationResolution(this, ball);
  }

  
  static collisionResultion(ball1: Ball, ball2: Ball){
    const normal = ball1.getPosition().subtr(ball2.getPosition()).unit();
    const relativeVelocity = ball1.velocity.subtr(ball2.velocity);
    const separatingVelocity = Vector.dot(relativeVelocity, normal);
    const newSeparatingVelocity = -separatingVelocity * Math.min(ball2.getElasticity(), ball1.getElasticity()); //elsaticity implementation

    const separatingVelocityDifference = newSeparatingVelocity - separatingVelocity;
    const impulse = separatingVelocityDifference / (ball1.getInverseMass() + ball2.getInverseMass());
    const impulseVelocity = normal.mult(impulse);
    
    ball1.velocity = ball1.velocity.add(impulseVelocity.mult(ball1.getInverseMass()));
    ball2.velocity = ball2.velocity.add(impulseVelocity.mult(-ball2.getInverseMass()));
  }


  collisionResolution(ball: Ball){
    Ball.collisionResultion(this, ball);
  }
}