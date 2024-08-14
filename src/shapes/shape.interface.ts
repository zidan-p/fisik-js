import { Vector } from "../vector";




export interface Shape {
  position: Vector
  render(...args: any[]): any;
}