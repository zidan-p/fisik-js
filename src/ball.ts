import { Controller } from "./controller";
import { Drawer } from "./drawer";
import { Vector } from "./vector";





export class Ball {
  
  private position: Vector;
  private radius: number;
  private color: string;
  private velocity = new Vector(0,0);
  private acceleration = new Vector(0,0);

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
  }

  private registerController(){
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
  }

}