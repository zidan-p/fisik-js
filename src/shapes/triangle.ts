import { Drawer } from "../drawer";
import { Matrix } from "../matrix";
import { Vector } from "../vector";
import { Shape } from "./shape.interface";
import { DrawOption } from "./draw-option.interface";



export class Triangle implements Shape {

  private _vertex: [Vector, Vector, Vector];
  private _position: Vector;
  private _direction: Vector;
  private _refDirection: Vector;
  private _rotationMatrix: Matrix<2,2> = new Matrix([[0,0], [0,0]]);
  private _angle: number = 0;

  private _refDiameter: [Vector, Vector, Vector];


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

    this._refDiameter = [
      this._vertex[0].subtr(this._position),
      this._vertex[1].subtr(this._position),
      this._vertex[2].subtr(this._position),
    ];


    
    this._drawer = drawOption.drawer;
    this._fillColor = drawOption.fillColor;
    this._strokeColor = drawOption.strokeColor;
  }

  public get vertex(){return this._vertex};
  public set vertex(v: [Vector, Vector, Vector]){this._vertex = v}

  public get direction(){return this._direction}
  public set direction(d: Vector){this._direction = d}

  public get angle(){return this._angle}
  public set angle(an: number){this._angle = an}

  get position(){return this._position}
  set position(p: Vector) {this._position = p}

  render() {
    if(!this._drawer) return;
   this._drawer.drawPolygon(this._vertex, this._fillColor, this._strokeColor)
   
  //  this._drawer.fillText("ref diameter : " + this._refDiameter, this.position.x - 10, this.position.y - 5);
  //  this._drawer.fillText("angle : " + this.angle, this.position.x - 10, this.position.y + 10);

  //  this._drawer.drawCircle(this._refDiameter[0].x, this._refDiameter[0].y, 30, undefined, undefined, "red")
  //  this._drawer.drawCircle(this._vertex[0].x, this._vertex[0].y, 6, undefined, undefined, "none")
  }
  
  getVertices(angle: number){
    this._rotationMatrix.rotationMatrix(angle);
    // this._direction = this._refDirection.multMatrix(this._rotationMatrix);
    this._direction = Matrix.multVector(this._rotationMatrix, this._refDirection);
    
    this._vertex[0] = this._position.add(Matrix.multVector(this._rotationMatrix, this._refDiameter[0]));
    this._vertex[1] = this._position.add(Matrix.multVector(this._rotationMatrix, this._refDiameter[1]));
    this._vertex[2] = this._position.add(Matrix.multVector(this._rotationMatrix, this._refDiameter[2]));

    // this._vertex[0] = this._position.add(this._refDiameter[0].multMatrix(this._rotationMatrix));
    // this._vertex[1] = this._position.add(this._refDiameter[1].multMatrix(this._rotationMatrix));
    // this._vertex[2] = this._position.add(this._refDiameter[2].multMatrix(this._rotationMatrix));
    // this._vertex.forEach(ver => this._drawer?.drawCircle(ver.x, ver.y, 10, undefined, undefined));
  }
}