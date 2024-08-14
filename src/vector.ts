import { Drawer } from "./drawer";
import { Matrix } from "./matrix";




export class Vector{

  constructor(
    public x: number,
    public y: number
  ){}

  set(x:number, y:number){
    this.x = x;
    this.y = y;
  }

  toString(){return "{x : " + this.x + ", y : " + this.y + "}"}

  add(v: Vector){
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subtr(v: Vector){
    return new Vector(this.x - v.x, this.y - v.y);
  }

  mag(){
    return Math.sqrt(this.x**2 + this.y**2);
  }

  mult(n: number){
    return new Vector(this.x*n, this.y*n);
  }

  multMatrix(mat: Matrix<2,2>){
    const result = new Vector(0,0);
    result.x = mat.data[0][0] * this.x + mat.data[0][1] * this.y;
    result.y = mat.data[1][0] * this.x + mat.data[1][1] * this.y;
    return result;
  }

  /** new intance for this vector */
  newInstance(){return new Vector(this.x, this.y)}

  static newInstance(vec: Vector){return new Vector(vec.x, vec.y)}

  //returns a perpendicular normal vector
  normal(){
    return new Vector(-this.y, this.x).unit();
  }

  //returns a vector with same direction and 1 length
  unit(){
    if(this.mag() === 0){
      return new Vector(0,0);
    } else {
        return new Vector(this.x / this.mag(), this.y / this.mag());
    }
  }

  //returns the length of a vectors projection onto the other one
  static dot(v1: Vector, v2: Vector){
    return v1.x*v2.x + v1.y*v2.y; 
  }

  dot(vec: Vector){
    return this.x * vec.x + this.y * vec.y;
  }

  static cross(vec1: Vector, vec2: Vector){
    return vec1.x * vec2.y - vec1.y * vec2.x;
  }

  drawViewLineToTargetVector(vecTarget: Vector, magnifier: number, drawer: Drawer, color: string ){
    Vector.drawViewLine(this, vecTarget, magnifier, drawer, color);
  }

  drawViewLineToThisVector(vecFrom: Vector, magnifier: number, drawer: Drawer, color: string){
    Vector.drawViewLine(vecFrom,this, magnifier, drawer, color)
  }

  static drawViewLine(origin: Vector, vec: Vector, magnifier: number, drawer: Drawer, color: string ){

    drawer.drawLine(
      origin.x, 
      origin.y, 
      origin.x + vec.x * magnifier, 
      origin.y + vec.y * magnifier, 
      color ?? "green"
    );
  }
}