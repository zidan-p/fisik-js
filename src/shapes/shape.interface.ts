import { Vector } from "../vector";




export interface Shape {
  position: Vector
  draw(...args: any[]): any;
}