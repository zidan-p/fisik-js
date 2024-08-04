import { Drawer } from "../drawer";
import { Vector } from "../vector";
import { DrawOption } from "./draw-option.interface";
import { Shape } from "./shape.interface";





export class Circle implements Shape {
  private _position: Vector;
  private _radius: number;
  private _vertex: Vector[];

  private _fillColor?: string;
  private _strokeColor?: string;
  private _drawer?: Drawer;

  constructor(
    position: Vector,
    radius: number,
    drawOption: DrawOption
  ){
    this._position = position.newInstance();
    this._radius = radius;
    this._fillColor = drawOption.fillColor;
    this._strokeColor = drawOption.strokeColor;
    this._drawer = drawOption.drawer;
    this._vertex = []
  }

  public get vertex(){return this._vertex};
  public set vertex(v: Vector[]){this._vertex = v}

  public get position (){return this._position}
  public set position(pos: Vector) {this._position = pos};

  public get radius() {return this._radius}
  public set radius(r: number){ this._radius = r}

  public draw(){
    this._drawer?.drawCircle(
      this._position.x,
      this._position.y,
      this._radius,
      undefined, undefined,
      this._fillColor, this._strokeColor
    )
  }
}