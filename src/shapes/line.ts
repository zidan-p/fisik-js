import { Drawer } from "../drawer";
import {Vector} from "../vector";
import { DrawOption } from "./draw-option.interface";
import { Shape } from "./shape.interface";


export class Line implements Shape {


  private _vertex: Vector[];
  private _direction: Vector;
  private _magnitude: number;

  private _fillColor?: string;
  private _strokeColor?: string;
  private _drawer?: Drawer;

  constructor(start: Vector, end: Vector, drawOption :DrawOption ){
    this._vertex = [];
    this._vertex[0] = start.newInstance();
    this._vertex[1] = end.newInstance();
    this._direction = this._vertex[1].subtr(this._vertex[0]).unit();
    this._magnitude = this._vertex[1].subtr(this._vertex[0]).mag();
    this._fillColor = drawOption.fillColor;
    this._strokeColor = drawOption.strokeColor;
    this._drawer = drawOption.drawer;
  }

  public get vertex(){return this._vertex};
  public set vertex(v: Vector[]){this._vertex = v}

  public get direction(){return this._direction}
  public set direction(d: Vector){this._direction = d}

  public get magnitude(){return this._magnitude}
  public set magnitude(m: number){this._magnitude = m}


  public draw(){
    this._drawer?.drawLine(
      this.vertex[0].x, 
      this._vertex[0].y, 
      this._vertex[1].x,
      this._vertex[1].y,
      this._strokeColor
    )
  }
}