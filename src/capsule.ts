import { Controller } from "./controller";
import { Drawer } from "./drawer";
import { LineSegment } from "./line-segment";
import { Matrix } from "./matrix";
import { Circle } from "./shapes/circle";
import { Rectangle } from "./shapes/rectangle";
import {Vector} from "./vector"

export class Capsule{

  private _componets: [Rectangle, Circle, Circle];


  private _vertex: Vector[];
  private _angleVelocity: number;
  private _velocity = new Vector(0,0);
  private _acceleration = new Vector(0,0);
  private _accelerationIncrement = 1;
  private _friction = 0.1
  private _mass: number = 10;
  private _inverseMass!: number;
  private _inertia!: number;
  private _inverseInertia!: number;
  private _elasticity = 0.5;

  public directionMovement = {
    up: false,
    down: false,
    right: false,
    left: false
  }


  private _drawer: Drawer;
  private _controller?: Controller


  constructor(start: Vector,end: Vector,rad: number, mass: number,drawer: Drawer, controller?: Controller){
    
    const circle1 = new Circle(start, rad, {drawer});
    const circle2 = new Circle(end, rad, {drawer});

    const recV1 = circle2.position.add(circle2.position.subtr(circle1.position).unit().normal().mult(rad));
    const recV2 = circle1.position.add(circle2.position.subtr(circle1.position).unit().normal().mult(rad));
    const rect = new Rectangle(recV1, recV2, 2 * rad, {drawer});

    this._componets = [rect, circle1, circle2]

    // becarefull, some of initializer properties happened here.
    // make sure dependent props already defined.
    this.mass = mass;

    this._vertex = [];


    this._angleVelocity = 0;

    this._controller = controller;
    this._drawer = drawer

    this.registerController()
  }

  public get position (){return this._componets[0].position}
  // public set position(pos: Vector) {this._position = pos};

  public set elasticity(n: number) {this._elasticity = n}
  public get elasticity(){return this._elasticity}

  public get velocity(){return this._velocity}
  public set velocity(v: Vector){this._velocity = v}


  public get angleVelocity(){return this._angleVelocity}
  public set angleVelocity(n: number){this._angleVelocity = n}

  public set vertex(v: Vector[]){this._vertex = v}
  public get vertex(){return this._vertex}


  // public get direction(){return this._direction}
  // public set direction(d: Vector){this._direction = d}

  public set inverseMass(n: number){this._inverseMass = n}
  public get inverseMass(){return this._inverseMass}

  public set components(comp: [Rectangle, Circle, Circle]){this._componets = comp}
  public get components(){return this._componets}

  public get rectangle(){return this._componets[0]}
  public get startCircle(){return this._componets[1]}
  public get endCircle(){return this._componets[2]}


  public setDefaultInverseMass(){
    this.mass === 0 ? this._inverseMass = 0 : this._inverseMass = 1 / this._mass
  }
  

  /** default using mass value */
  public set inertia(inert: number){this._inertia = inert;}
  public setDefaultInertia(radius: number){
    this._inertia = this._mass * ((2 * radius)**2 + (this.._length + 2 * radius)**2 ) / 12;
  }
  public get inertia(){return this._inertia}

  public get inverseInertia(){return this._inverseInertia}
  public set inverseInertia(n: number){this._inverseInertia = n}
  public setDefaultInverseInertia(){
    if(this.mass === 0){
      this._inverseInertia = 0;
    } else {
      this._inverseInertia = 1 / this._inertia;
    }
  }

  public set mass(n: number){
    this._mass = n;
    
    this.setDefaultInverseMass();
    this.setDefaultInertia(this._componets[0].angle); //it must first before inverse innertia
    this.setDefaultInverseInertia();
  }
  public getMass(){return this._mass};


  registerController(){
    console.log("registering controller");
    if(!this._controller) {
      console.log("controller not defined");
      return;
    }

    this._controller.onDown(() => this.directionMovement.down = true);
    this._controller.onUp(() => this.directionMovement.up = true);
    this._controller.onRight(() => this.directionMovement.right = true);
    this._controller.onLeft(() => this.directionMovement.left = true);

    this._controller.onReleaseDown(() => this.directionMovement.down = false);
    this._controller.onReleaseUp(() => this.directionMovement.up = false);
    this._controller.onReleaseRight(() => this.directionMovement.right = false);
    this._controller.onReleaseLeft(() => this.directionMovement.left = false);
  }

  keyControl(){
    if(this.directionMovement.up){
      this._acceleration = this._direction.mult(-this._accelerationIncrement);
    }
    if(this.directionMovement.down){ 
      this._acceleration = this._direction.mult(this._accelerationIncrement);
    }
    // if(this.directionMovement.left) this._acceleration.x = -this._accelerationIncrement;
    // if(this.directionMovement.right) this._acceleration.x = this._accelerationIncrement;

    if(this.directionMovement.left) this._angleVelocity -= 0.005;
    if(this.directionMovement.right) this._angleVelocity += 0.005;

    if(!this.directionMovement.up && !this.directionMovement.down){
      this._acceleration = new Vector(0,0)
    }
  }

  reposition(){
    this._acceleration = this._acceleration.unit().mult(this._accelerationIncrement);
    this._velocity = this._velocity.add(this._acceleration);
    this._velocity = this._velocity.mult(1 - this._friction);
    this._componets[0].position = this._componets[0].position.add(this._velocity);

    this._angleVelocity *= 0.96;
    this._componets[0].angle += this._angleVelocity;
    this._componets[0].getVertices();

    this._componets[1].position = this._componets[0].position.add(this._componets[0].direction.mult(-this._componets[0].length/2))
    this._componets[2].position = this._componets[0].position.add(this._componets[0].direction.mult(this._componets[0].length/2))
  }

  // line segment of closest point of certain position with capsule line
  static closestPointPositionToCapsuleLine(position: Vector, capsule: Capsule){
    return LineSegment.closestPointPositionToLineSegment(position, capsule._componets[0]);
  }

  closestPointPositionToCapsuleLine(position: Vector){
    return Capsule.closestPointPositionToCapsuleLine(position, this);
  }


  static collisionDetectionBetweenCapsules(cap1: Capsule, cap2: Capsule){
    const closestPoint = LineSegment.closestPointBetweenLineSegemnt(cap1._componets[0], cap2.components[0]);
    if(cap1.components[1].radius + cap2.components[1].radius >= closestPoint[0].subtr(closestPoint[1]).mag())
      return true;
    return false;
  }

  collisionDetectionBetweenCapsules(cap: Capsule){
    return Capsule.collisionDetectionBetweenCapsules(this, cap);
  }

  static penetrationResolutionBetweenCapsules(cap1: Capsule, cap2: Capsule){
    const closestPoint = LineSegment.closestPointBetweenLineSegemnt(cap1.components[0], cap2.components[0]);

    const distance = closestPoint[0].subtr(closestPoint[1]);

    const penetrationDepth = cap1.components[1].radius + cap2.components[1].radius - distance.mag();

    const penetrationResolution = distance.unit().mult(penetrationDepth / (cap1.inverseMass + cap2.inverseMass));

    cap1.position = cap1.position.add(penetrationResolution.mult(cap1.inverseMass));
    cap2.position = cap2.position.add(penetrationResolution.mult(-cap2.inverseMass));
  }

  penetrationResolutionBetweenCapsules(capsule: Capsule){
    Capsule.penetrationResolutionBetweenCapsules(this, capsule);
  }

  
  static collisionResolutionBetweenCapsules(cap1: Capsule, cap2: Capsule){
    const closestPoint = LineSegment.closestPointBetweenLineSegemnt(cap1.components[0], cap2.components[0]);

    const normal = closestPoint[0].subtr(closestPoint[1]).unit();

    // closing velocity
    const collisionArm1 = closestPoint[0].subtr(cap1.position).add(normal.mult(cap1.components[1].radius));
    const rotationVelocity1 = new Vector(-cap1.angleVelocity * collisionArm1.y, cap1.angleVelocity * collisionArm1.x);
    const closingVelocity1 = cap1.velocity.add(rotationVelocity1);

    const collisionArm2 = closestPoint[1].subtr(cap2.position).add(normal.mult(-cap2.components[1].radius));
    const rotationVelocity2 = new Vector(-cap2.angleVelocity * collisionArm2.y, cap2.angleVelocity * collisionArm2.x);
    const closingVelocity2 = cap2.velocity.add(rotationVelocity2);



    // 2. impulse augmentation
    let impulseAugmentation1 = Vector.cross(collisionArm1, normal);
    impulseAugmentation1 = impulseAugmentation1 * cap1.inverseInertia * impulseAugmentation1;


    let impulseAugmentation2 = Vector.cross(collisionArm2, normal);
    impulseAugmentation2 = impulseAugmentation2 * cap2.inverseInertia * impulseAugmentation2;

    const relativeVelocity = closingVelocity1.subtr(closingVelocity2);
    const separatingVelocity = Vector.dot(relativeVelocity, normal);
    const newSeparatingVelocity = -separatingVelocity * Math.min(cap2.elasticity, cap1.elasticity); //elsaticity implementation

    const separatingVelocityDifference = newSeparatingVelocity - separatingVelocity;

    const impulse = 
      separatingVelocityDifference / 
      (cap1.inverseMass + cap2.inverseMass + impulseAugmentation1 + impulseAugmentation2);
    

    const impulseVelocity = normal.mult(impulse);

    // 3. changing the velocities
    cap1.velocity = cap1.velocity.add(impulseVelocity.mult(cap1.inverseMass));
    cap2.velocity = cap2.velocity.add(impulseVelocity.mult(-cap2.inverseMass));

    cap1.angleVelocity += cap1.inverseInertia * Vector.cross(collisionArm1, impulseVelocity);
    cap2.angleVelocity -= cap2.inverseInertia * Vector.cross(collisionArm2, impulseVelocity);

  }


  collisionResolutionBetweenCapsules(capsule: Capsule){
    Capsule.collisionResolutionBetweenCapsules(this, capsule);
  }

  move(){
    this.keyControl();
    this.reposition();
  }

  draw(){

    this._componets[0].draw();
    this._componets[1].draw();
    this._componets[2].draw();
  }

}