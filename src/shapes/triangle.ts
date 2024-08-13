import { Drawer } from "../drawer";
import { Matrix } from "../matrix";
import { Vector } from "../vector";
import { Shape } from "./shape.interface";
import { DrawOption } from "./draw-option.interface";



export class Triangle implements Shape {

  private _vertex: [Vector, Vector, Vector]
  private _position: Vector;
  private _direction: Vector;
  private _refDirection: Vector;
  private _rotationMatrix: Matrix<2,2> = new Matrix([[0,0], [0,0]]);
  private _angle: number = 0;


  private _fillColor?: string;
  private _strokeColor?: string;
  private _drawer?: Drawer;

  constructor(point1: Vector, point2: Vector, point3: Vector, drawOption: DrawOption){

    this._vertex = [point1, point2, point3];
    this._position = new Vector(
      (this._vertex[0].x + this._vertex[1].x + this._vertex[2].x) / 3,
      (this._vertex[0].y + this._vertex[1].y + this._vertex[2].y) / 3,
    )

    this._direction = this._vertex[0].subtr(this._position).unit();
    this._refDirection = this._direction

    
    this._drawer = drawOption.drawer;
    this._fillColor = drawOption.fillColor;
    this._strokeColor = drawOption.strokeColor;
  }

  get position(){return this._position}
  set position(p: Vector) {this._position = p}

  draw() {
    
  }
}