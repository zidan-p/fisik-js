import { Drawer } from "../drawer";
import { Matrix } from "../matrix";
import { Vector } from "../vector";
import { DrawOption } from "./draw-option.interface";
import { Shape } from "./shape.interface";





export class Rectangle implements Shape {
  private _direction: Vector;
  private _vertex: [Vector, Vector, Vector, Vector];
  private _position: Vector;
  private _angle: number;
  private _rotationMatrix: Matrix<2,2> = new Matrix([[0,0], [0,0]]);

  private _edge: Vector;
  private _length: number;
  private _width: number;
  private _refDirection: Vector;


  public start: Vector;
  public end: Vector;

  public directionMovement = {
    up: false,
    down: false,
    right: false,
    left: false
  }


  private _drawer: Drawer;
  private _fillColor?: string;
  private _strokeColor?: string;

  constructor(start: Vector,end: Vector,width: number, drawOption: DrawOption){
    //@ts-ignore
    this._vertex = [];
    this._vertex[0] = start.newInstance();
    this._vertex[1] = end.newInstance();
    this._edge = this._vertex[1].subtr(this._vertex[0]);

    this.start = start;
    this.end = end;

    this._width = width;
    this._length = this._edge.mag();
    this._direction = this._edge.unit();
    this._refDirection = this._edge.unit();


    this._position = this._vertex[0]
      .add(this._direction.mult(this._length / 2))
      .add(this._direction.normal().mult(this._width / 2))
    
    this._angle = 0;
    

    this._vertex[2] = this._vertex[1].add(this._direction.normal().mult(this._width));
    this._vertex[3] = this._vertex[2].add(this._direction.mult(-this._length));

    this._drawer = drawOption.drawer;
    this._fillColor = drawOption.fillColor;
    this._strokeColor = drawOption.strokeColor;

  }

  public get position (){return this._position}
  public set position(pos: Vector) {this._position = pos};


  public get vertex(){return this._vertex};
  public set vertex(v: [Vector, Vector, Vector, Vector]){this._vertex = v}

  public get width(){return this._width}
  public set width(r: number){this._width = r}

  public get direction(){return this._direction}
  public set direction(d: Vector){this._direction = d}

  public get angle(){return this._angle}
  public set angle(an: number){this._angle = an}

  public set length(l: number){this.length = l}
  public get length(){return this._length}


  public getVertices(){
    this._rotationMatrix = Matrix.rotationMatrix(this._angle);
    this._direction = this._refDirection.multMatrix(this._rotationMatrix);

    this._vertex[0] = this._position
      .add(this._direction.mult(-this._length / 2))
      .add(this._direction.normal().mult(this._width / 2));

    this._vertex[1] = this._position
      .add(this._direction.mult(-this._length / 2))
      .add(this._direction.normal().mult(-this._width / 2));

    this._vertex[2] = this._position
      .add(this._direction.mult(this._length / 2))
      .add(this._direction.normal().mult(-this._width / 2));

    this._vertex[3] = this._position
      .add(this._direction.mult(this._length / 2))
      .add(this._direction.normal().mult(this._width / 2));
  }

  draw(){
    this._drawer.drawRectangle(this._vertex, this._fillColor, this._strokeColor);
    this._drawer.drawCircle(this._position.x, this._position.y, 10, undefined, undefined, "none", "red")
  }
}