import { Ball } from './bodies/ball';
import { Box } from './box';
import { Capsule } from './bodies/capsule';
import { HTMLElementController } from './controller';
import { CanvasDrawer } from './drawer';
import { LineSegment, SATResult } from './line-segment';
import './style.css'
import { NumberUtils } from './util';
import { Vector } from './vector';
import { Wall } from './bodies/wall';
import { Body } from './body';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const controller = new HTMLElementController(canvas);
export const drawer = new CanvasDrawer(ctx);

const bodies: Body[] = []

// --- player and ball --
const playerBall = new Ball(new Vector(200, 200), 30, drawer, 1000, "none","black", controller);
const ball = new Ball(new Vector(200, 200), 30, drawer, 1000, "none", "black");
const balls: Ball[] = [];

bodies.push(playerBall);

// -- walls ---
const walls: Wall[] = [];
// walls.push(new Wall(new Vector(200, 200), new Vector(400, 300), drawer, controller));
walls.push(
  new Wall(new Vector(0, 0), new Vector(0, canvas.clientHeight), drawer),
  new Wall(new Vector(0, 0), new Vector(canvas.clientWidth, 0), drawer),
  new Wall(new Vector(0, canvas.clientHeight), new Vector(canvas.clientWidth, canvas.clientHeight), drawer),
  new Wall(new Vector(canvas.clientWidth, 0), new Vector(canvas.clientWidth, canvas.clientHeight), drawer),
)


const wall1 = new Wall(new Vector(300, 100), new Vector(200, 330), drawer);
const wall2 = new Wall(new Vector(150, 300), new Vector(350, 300), drawer);


bodies.push(wall1);

// -- capsules --
// const capsules: Capsule[] = [];
const playerCapsule = new Capsule(
  new Vector(200, 350),
  new Vector(200, 200),
  50, 10,
  {drawer, fillColor: "none"}
  , controller
);
const capsule = new Capsule(  
  new Vector(500, 350),
  new Vector(500, 200),
  50, 10,
  {drawer, fillColor: "none"}
)
// capsules.push(new Capsule(new Vector(100, 50), new Vector(100, 300), 30,2, drawer));
// capsules.push(playerCapsule);

bodies.push(capsule);

const box = new Box(new Vector(100, 100), new Vector(200, 100), 40, 20, {drawer, fillColor: "none"}, controller);
// const box2 = new Box(new Vector(100, 300), new Vector(200, 300), 40, 20, drawer);

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

function mainLoop(timeStamp: number){
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  bodies.forEach((b, i) => {
    b.move();
    b.draw();
  })

  // let bestSAT: Nullable<SATResult> = {
  //   axis: null,
  //   penetration: null,
  //   vertex: null
  // }

  // for(let o1comp = 0; o1comp < capsule.components.length; o1comp++ ){
  //   for(let o2comp = 0; o2comp < capsule.components.length; o2comp++ ){
  //     const satResult = LineSegment.sat(capsule.components[o1comp], playerCapsule.components[o2comp]);
  //     if(!satResult) continue;
  //     if(Number(satResult.penetration) > Number(bestSAT.penetration)){
  //         bestSAT = satResult;
  //         ctx.fillText("COLLISION", 500, 400);
  //     }
  //   }
  // }
  requestAnimationFrame(mainLoop);
}


requestAnimationFrame(mainLoop);