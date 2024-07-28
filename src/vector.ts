import { Drawer } from "./drawer";




export class Vector{

  constructor(
    public x: number,
    public y: number
  ){}


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