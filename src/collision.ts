import { Body } from "./body";
import { LineSegment } from "./line-segment";
import { Vector } from "./vector";




export class Collision {

  private _object1: Body;
  private _object2: Body;
  private _normal: Vector = new Vector(0,0);
  private _penetrationDepth: number = 0;
  private _closestPoint: Vector = new Vector(0,0);

  constructor(body1: Body, body2: Body, normal: Vector, penetrationDepth: number, cp: Vector ){
    this._object1 = body1;
    this._object2 = body2;
    this._normal = normal;
    this._penetrationDepth = penetrationDepth;
    this._closestPoint = cp;
  }

  get object1(){return this._object1}
  set object1(o: Body){this._object1 = o}

  get object2(){return this._object2}
  set object2(o: Body){this._object2 = o}

  get normal(){return this._normal}
  set normal(n: Vector){this._normal = n}

  get penetrationDepth(){return this._penetrationDepth}
  set penetrationDepth(p: number){this._penetrationDepth = p}

  get closestPoint(){return this._closestPoint}
  set closestPoint(cp: Vector){this._closestPoint = cp}

  public penetrationresolution(){
    let penetrationResolution = this.normal
      .mult(this.penetrationDepth / (this.object1.inverseMass + this._object2.inverseMass));

    this.object1.components[0].position = this.object1.components[0].position
      .add(penetrationResolution.mult(this.object1.inverseMass));

    this.object2.components[0].position = this.object2.components[0].position
      .add(penetrationResolution.mult(-this.object2.inverseMass));
  }

  public collisionResolutionBroke(){
    //1. Closing velocity
    let collArm1 = this._closestPoint.subtr(this._object1.components[0].position);
    let rotVel1 = new Vector(-this._object1.angleVelocity * collArm1.y, this._object1.angleVelocity * collArm1.x);
    let closVel1 = this._object1.velocity.add(rotVel1);
    let collArm2 = this._closestPoint.subtr(this._object1.components[0].position);
    let rotVel2= new Vector(-this._object1.angleVelocity * collArm2.y, this._object1.angleVelocity * collArm2.x);
    let closVel2 = this._object1.velocity.add(rotVel2);

    //2. Impulse augmentation
    let impAug1 = Vector.cross(collArm1, this.normal);
    impAug1 = impAug1 * this._object1.inverseInertia * impAug1;
    let impAug2 = Vector.cross(collArm2, this.normal);
    impAug2 = impAug2 * this._object1.inverseInertia * impAug2;

    let relVel = closVel1.subtr(closVel2);
    let sepVel = Vector.dot(relVel, this.normal);
    let new_sepVel = -sepVel * Math.min(this._object1.elasticity, this._object1.elasticity);
    let vsep_diff = new_sepVel - sepVel;

    let impulse = vsep_diff / (this._object1.inverseMass + this._object1.inverseMass + impAug1 + impAug2);
    let impulseVec = this.normal.mult(impulse);

    //3. Changing the velocities
    this._object1.velocity = this._object1.velocity.add(impulseVec.mult(this._object1.inverseMass));
    this._object1.velocity = this._object1.velocity.add(impulseVec.mult(-this._object1.inverseMass));

    this._object1.angleVelocity += this._object1.inverseInertia * Vector.cross(collArm1, impulseVec);
    this._object1.angleVelocity -= this._object1.inverseInertia * Vector.cross(collArm2, impulseVec); 
  }

  public collisionResolution(){


    // const normal = this.closestPoint.subtr(this.closestPoint).unit();

    console.log(JSON.stringify(this._object1, null, 2));
    console.log(JSON.stringify(this._object2, null, 2));

    // closing velocity
    const collisionArm1 = this.closestPoint.subtr(this.object1.components[0].position);
    const rotationVelocity1 = new Vector(-this.object1.angleVelocity * collisionArm1.y, this.object1.angleVelocity * collisionArm1.x);
    const closingVelocity1 = this.object1.velocity.add(rotationVelocity1);

    const collisionArm2 = this.closestPoint.subtr(this.object2.components[0].position);
    const rotationVelocity2 = new Vector(-this.object2.angleVelocity * collisionArm2.y, this.object2.angleVelocity * collisionArm2.x);
    const closingVelocity2 = this.object2.velocity.add(rotationVelocity2);

    console.log("collision arm 1 : " + collisionArm1);
    console.log("collision arm 2 : " + collisionArm2);

    // 2. impulse augmentation
    let impulseAugmentation1 = Vector.cross(collisionArm1, this.normal);
    impulseAugmentation1 = impulseAugmentation1 * this.object1.inverseInertia * impulseAugmentation1;


    let impulseAugmentation2 = Vector.cross(collisionArm2, this.normal);
    impulseAugmentation2 = impulseAugmentation2 * this.object2.inverseInertia * impulseAugmentation2;

    const relativeVelocity = closingVelocity1.subtr(closingVelocity2);
    const separatingVelocity = Vector.dot(relativeVelocity, this.normal);
    const newSeparatingVelocity = -separatingVelocity * Math.min(this.object2.elasticity, this.object1.elasticity); //elsaticity implementation

    const separatingVelocityDifference = newSeparatingVelocity - separatingVelocity;

    const impulse = 
      separatingVelocityDifference / 
      (this.object1.inverseMass + this.object2.inverseMass + impulseAugmentation1 + impulseAugmentation2);
    
    console.log("impulse : " + impulse);

    const impulseVelocity = this.normal.mult(impulse);

    console.log("impulse velocity : " + impulseVelocity);

    // 3. changing the velocities
    this.object1.velocity = this.object1.velocity.add(impulseVelocity.mult(this.object1.inverseMass));
    this.object2.velocity = this.object2.velocity.add(impulseVelocity.mult(-this.object2.inverseMass));

    console.log("object1 velocity : " + this.object1.velocity);
    console.log("object2 velocity : " + this.object2.velocity);

    console.log("new angular vel : " +  this.object1.inverseInertia * Vector.cross(collisionArm1, impulseVelocity));

    this.object1.angleVelocity += this.object1.inverseInertia * Vector.cross(collisionArm1, impulseVelocity);
    this.object2.angleVelocity -= this.object2.inverseInertia * Vector.cross(collisionArm2, impulseVelocity);
  }
}