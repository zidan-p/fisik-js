import { Body } from "../body";
import { Controller } from "../controller";
import { Drawer } from "../drawer";
import { LineSegment } from "../line-segment";
import { Line } from "../shapes/line";
import { Vector } from "../vector";
import { Ball } from "./ball";


export class Wall extends Body implements LineSegment{

  private _components: [Line];

  public directionMovement = {
    up: false,
    down: false,
    right: false,
    left: false
  }

  private  _direction: Vector;
  private _vertex: Vector[];

  private _start: Vector;
  private _end: Vector;
  private _refStart: Vector;
  private _refEnd: Vector;
  private _refUnit: Vector;
  

  private _color: string = "black";

  constructor(
    start: Vector,
    end: Vector,
    private drawer: Drawer,
    controller?: Controller
  ){
    super(start.add(end).mult(0.5), 0, 0, controller);
    this._start = start;
    this._end = end;
    this._direction = end.subtr(start).unit();
    this._vertex = [this._start, this._end]

    this._refStart = this._start.newInstance();
    this._refEnd = this._end.newInstance();
    this._refUnit = this._end.subtr(this._start).unit();

    this._components = [new Line(start, end, {drawer})];

    this.setPhysicsComponent();
  }

  public get direction(){return this._direction}
  public set direction(d: Vector){this._direction = d}

  public set vertex(v: Vector[]){this._vertex = v}
  public get vertex(){return this._vertex}

  get start(){return this._start}
  set start(pos: Vector){this._start = pos}

  get end(){return this._end}
  set end(pos: Vector){this._end = pos}

  get color(){return this._color}
  set color(c: string){this._color = c}

  set components(c: [Line]){this._components = c}
  get components(){return this._components}

  wallUnit(){return this._end.subtr(this._start).unit()}


  public keyControl(){
    if(this.directionMovement.left) this._angleVelocity -= this._angleAcceleration;
    if(this.directionMovement.right) this._angleVelocity += this._angleAcceleration;
  }

  public reposition(){ super.reposition()}

  move(){
    this.keyControl();
    this.reposition();
  }

  render(){super.render()}
}