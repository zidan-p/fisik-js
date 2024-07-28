import { Controller } from "./controller";
import { Drawer } from "./drawer";
import { Vector } from "./vector";





export class Ball {
  
  private position: Vector;
  private radius: number;
  private color: string;
  private velocity = new Vector(0,0);
  private acceleration = new Vector(0,0);

  public static lineHelper = new Vector(550, 400);

  public direction = {
    up: false,
    down: false,
    right: false,
    left: false
  }

  private drawer: Drawer;

  private accelerationIncrement = 1;
  private friction = 0.1
  private controller?: Controller;

  constructor(
    position: Vector, 
    radius: number,
    drawer: Drawer,
    color?: string,
    controller?: Controller,
  ){
    this.position = position;
    this.radius = radius
    this.drawer = drawer;
    this.color = color ?? "#dc2626";
    this.controller = controller;

    if(this.controller) this.registerController();
  }

  public getPosition (){return this.position}
  public setPosition(pos: Vector) {this.position = pos};

  public getRadius() {return this.radius}
  public setRadius(r: number){ this.radius = r}

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
    Vector.drawViewLine(Ball.lineHelper, this.acceleration, 50, this.drawer, "green");
    Vector.drawViewLine(Ball.lineHelper, this.velocity, 10, this.drawer, "red");
  }


  static collisionDetection(ball1: Ball, ball2: Ball){
    if(ball1.getRadius() + ball2.getRadius() >= ball2.getPosition().subtr(ball1.getPosition()).mag()) return true;
    return false;
  }

  collisionDetection(ball: Ball){
    if(this.getRadius() + ball.getRadius() >= ball.getPosition().subtr(this.getPosition()).mag()) return true;
    return false;
  }


  static penetrationResolution(ball1: Ball, ball2: Ball){
    const distance = ball1.getPosition().subtr(ball2.getPosition());
    const penetrationDepth = ball1.getRadius() + ball2.getRadius() - distance.mag();
    const penetrationResolution = distance.unit().mult(penetrationDepth / 2);
    ball1.setPosition(ball1.getPosition().add(penetrationResolution));
    ball2.setPosition(ball2.getPosition().add(penetrationResolution.mult(-1)));
  }

  penetrationResolution(ball: Ball){
    const distance = this.getPosition().subtr(ball.getPosition());
    const penetrationDepth = this.getRadius() + ball.getRadius() - distance.mag();
    const penetrationResolution = distance.unit().mult(penetrationDepth / 2);
    this.setPosition(this.getPosition().add(penetrationResolution));
    ball.setPosition(ball.getPosition().add(penetrationResolution.mult(-1)));
  }

}