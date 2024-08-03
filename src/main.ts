import { Ball } from './ball';
import { Box } from './box';
import { Capsule } from './capsule';
import { HTMLElementController } from './controller';
import { CanvasDrawer } from './drawer';
import { LineSegment } from './line-segment';
import './style.css'
import { NumberUtils } from './util';
import { Vector } from './vector';
import { Wall } from './wall';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const controller = new HTMLElementController(canvas);
const drawer = new CanvasDrawer(ctx);


// --- player and ball --
// const playerBall = new Ball(new Vector(200, 200), 30, drawer, 1000, "#6ee7b7", controller);
const balls: Ball[] = [];


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

// -- capsules --
// const capsules: Capsule[] = [];
// const playerCapsule = new Capsule(
//   new Vector(200, 300),
//   new Vector(400, 200),
//   20, 10,
//   drawer, controller
// );
// capsules.push(new Capsule(new Vector(100, 50), new Vector(100, 300), 30,2, drawer));
// capsules.push(playerCapsule);

const box = new Box(new Vector(100, 100), new Vector(200, 100), 40, 20, drawer, controller);
const box2 = new Box(new Vector(100, 300), new Vector(200, 300), 40, 20, drawer, controller);

function mainLoop(timeStamp: number){
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  box.draw();
  box.move();
  box2.draw();
  box2.move();
  // wall1.draw();
  // wall2.draw();

  // if(LineSegment.sat(wall1, wall2)){
  //   ctx.fillText("wall collision....", 500, 400);
  // }

  // // draw distance wall
  // walls[0].closestPosintBallandWall(playerBall)
  //   .subtr(playerBall.getPosition())
  //   .drawViewLineToThisVector(playerBall.getPosition(), 1, drawer, "#831843");


  requestAnimationFrame(mainLoop);
}


requestAnimationFrame(mainLoop);