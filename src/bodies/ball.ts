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
    super(position, 0, mass, controller);

    // // this._radius = radius
    this.drawer = drawer;
    this.color = color ?? "#dc2626";
    this.controller = controller;
    this.strokeColor = strokeColor;

    this._vertex = []

    this._components = [new Circle(position, radius, {drawer, fillColor: color, strokeColor})]

    this.setPhysicsComponent();
  }


  public set vertex(v: Vector[]){this._vertex = v}
  public get vertex(){return this._vertex}

  public get components(){return this._components}
  public set components(c: [Circle]){this._components = c}


  keyControl(){
    if(this.directionMovement.left){
      this.acceleration.x = -this._keyForce;
    }
    if(this.directionMovement.up){
      this.acceleration.y = -this._keyForce;
    }
    if(this.directionMovement.right){
      this.acceleration.x = this._keyForce;
    }
    if(this.directionMovement.down){ 
      this.acceleration.y = this._keyForce;
    }
    if(!this.directionMovement.left && !this.directionMovement.right){
      this.acceleration.x = 0;
    }
    if(!this.directionMovement.up && !this.directionMovement.down){
      this.acceleration.y = 0;
    }
  }

  setPosition(pos: Vector, angle?: number): void {
    this._components[0].position = pos;
    this.position = pos
  }

  reposition(){
    super.reposition();
    this.setPosition(this.position);
  }

  move(){
    this.keyControl();
    this.reposition();
  }

  render(){
    // this.drawer.drawCircle(this._position.x, this._position.y, this._radius, undefined, undefined, this.color, this.strokeColor);

    // draw info
    
    // this.drawer.fillText("velocity: " + NumberUtils.round(this._velocity.x), 500, 410);
    // this.drawer.fillText("pos x: " + NumberUtils.round( this._components[0].position.x), 500, 400);
    // this.drawer.fillText("pos y: " + NumberUtils.round(this._components[0].position.y), 500, 390);

    super.render();

    // also draw vector helper
    Vector.drawViewLine(this._components[0].position, this.acceleration, 50, this.drawer, "green");
    Vector.drawViewLine(this._components[0].position, this._velocity, 15, this.drawer, "red");

    // add stat of ball
    this.drawer.fillText("M : " + this._mass, this._components[0].position.x - 10, this._components[0].position.y - 5);
    this.drawer.fillText("E : " + this._elasticity, this._components[0].position.x - 10, this._components[0].position.y + 5);
  }
}



export function generateRandomBall(count: number, canvas: HTMLCanvasElement, drawer: Drawer){
  const balls: Ball[] = [];

  for(let i = 0; i < count; i ++){
    const newObj = new Ball(
      new Vector(Math.random() * canvas.clientWidth, Math.random() * canvas.clientHeight),
      NumberUtils.getRandomInt(10, 50),
      drawer, 
      NumberUtils.getRandomInt(10, 30), 
      "#6ee7b7"
    );

    newObj.elasticity = (NumberUtils.getRandomInt(1,3))
    newObj.friction = 0.001
    balls.push(newObj);
  }
  
  return balls;
}