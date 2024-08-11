import { Vector } from "./vector";




export class Collision {

  private _object1: Body;
  private _object2: Body;
  private _normal: Vector = new Vector(0,0);
  private _penetrationDepth: number = 0;
  private _collisionPoint: Vector = new Vector(0,0);

  constructor(body1: Body, body2: Body, normal: number, cp: Vector ){
    this._object1 = body1;
    this._object2 = body2;
  }

  get object1(){return this._object1}
  set object1(o: Body){this._object1 = o}

  get object2(){return this._object2}
  set object2(o: Body){this._object2 = o}

  get normal(){return this._normal}
  set normal(n: Vector){this._normal = n}

  get penetrationDepth(){return this._penetrationDepth}
  set penetrationDepth(p: number){this._penetrationDepth = p}

  get collisionPoint(){return this._collisionPoint}
  set collisionPoint(cp: Vector){this._collisionPoint = cp}
}