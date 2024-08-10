import { Ball } from './bodies/ball';
import { Box } from './box';
import { Capsule } from './capsule';
import { HTMLElementController } from './controller';
import { CanvasDrawer } from './drawer';
import { LineSegment, SATResult } from './line-segment';
import './style.css'
import { NumberUtils } from './util';
import { Vector } from './vector';
import { Wall } from './wall';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const controller = new HTMLElementController(canvas);
export const drawer = new CanvasDrawer(ctx);


// --- player and ball --
const playerBall = new Ball(new Vector(200, 200), 30, drawer, 1000, "none","black", controller);
const ball = new Ball(new Vector(200, 200), 30, drawer, 1000, "none", "black");
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

const box = new Box(new Vector(100, 100), new Vector(200, 100), 40, 20, {drawer, fillColor: "none"}, controller);
// const box2 = new Box(new Vector(100, 300), new Vector(200, 300), 40, 20, drawer);

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

function mainLoop(timeStamp: number){
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  // box.draw();
  // box.move();
  // box2.draw(); 
  // box2.move();
  // ball.draw();
  // ball.move();
  // playerBall.draw();
  // playerBall.move();
  playerCapsule.move();
  playerCapsule.draw();
  capsule.move();
  capsule.draw();
  // wall1.draw();
  // wall2.draw();

  let bestSAT: Nullable<SATResult> = {
    axis: null,
    penetration: null,
    vertex: null
  }

  for(let o1comp = 0; o1comp < capsule.components.length; o1comp++ ){
    for(let o2comp = 0; o2comp < capsule.components.length; o2comp++ ){
      const satResult = LineSegment.sat(capsule.components[o1comp], playerCapsule.components[o2comp]);
      if(!satResult) continue;
      if(Number(satResult.penetration) > Number(bestSAT.penetration)){
          bestSAT = satResult;
          ctx.fillText("COLLISION", 500, 400);
      }
    }
}

if(bestSAT.penetration !== null && bestSAT.axis !== null){
  // bestSAT.axis.drawViewLineToTargetVector(bestSAT.vertex!, bestSAT.penetration, drawer, "blue")
  bestSAT.axis.drawViewLineToThisVector(bestSAT.vertex!, bestSAT.penetration, drawer, "blue")
    // bestSAT.axis.drawVec(bestSAT.vertex.x, bestSAT.vertex.y, bestSAT.penetration, "blue");
}

  // for(let i = 0; i < playerCapsule.components.length; i++){
  //   if(LineSegment.sat(playerCapsule.components[i], wall1.components[0])){
  //     ctx.fillText("wall collision....", 500, 400);
  //   }
  // }


  // if(LineSegment.sat(box.components[0], wall1.components[0])){
  //   ctx.fillText("wall collision....", 500, 400);
  // }

  // if(LineSegment.sat(playerBall.component[0], wall1.component[0])){
  //   ctx.fillText("wall collision....", 500, 400);
  // }
  // if(LineSegment.satBoxAndBall(box, wall1)){
  //   ctx.fillText("wall collision....", 500, 400);
  // }



  // // draw distance wall
  // walls[0].closestPosintBallandWall(playerBall)
  //   .subtr(playerBall.getPosition())
  //   .drawViewLineToThisVector(playerBall.getPosition(), 1, drawer, "#831843");


  requestAnimationFrame(mainLoop);
}


requestAnimationFrame(mainLoop);