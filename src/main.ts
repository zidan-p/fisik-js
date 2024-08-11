import { Ball } from './bodies/ball';
import { Capsule } from './bodies/capsule';
import { HTMLElementController } from './controller';
import { CanvasDrawer } from './drawer';
import { LineSegment, SATResult } from './line-segment';
import './style.css'
import { NumberUtils } from './util';
import { Vector } from './vector';
import { Wall } from './bodies/wall';
import { Body } from './body';
import { Box } from './bodies/box';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const controller = new HTMLElementController(canvas);
export const drawer = new CanvasDrawer(ctx);

const bodies: Body[] = []

// --- player and ball --
const playerBall = new Ball(new Vector(200, 200), 30, drawer, 1000, "none","black", controller);
// const ball = new Ball(new Vector(200, 200), 30, drawer, 1000, "none", "black");
// const balls: Ball[] = [];

console.log("after registering ball controller");
bodies.push(playerBall);

// -- walls ---
const walls: Wall[] = [];
// walls.push(new Wall(new Vector(200, 200), new Vector(400, 300), drawer, controller));
// walls.push(
//   new Wall(new Vector(0, 0), new Vector(0, canvas.clientHeight), drawer),
//   new Wall(new Vector(0, 0), new Vector(canvas.clientWidth, 0), drawer),
//   new Wall(new Vector(0, canvas.clientHeight), new Vector(canvas.clientWidth, canvas.clientHeight), drawer),
//   new Wall(new Vector(canvas.clientWidth, 0), new Vector(canvas.clientWidth, canvas.clientHeight), drawer),
// )


const wall1 = new Wall(new Vector(300, 100), new Vector(200, 330), drawer);
// const wall2 = new Wall(new Vector(150, 300), new Vector(350, 300), drawer);

console.log("after registering wall controller")
bodies.push(wall1);

// -- capsules --
// const capsules: Capsule[] = [];
// const playerCapsule = new Capsule(
//   new Vector(200, 350),
//   new Vector(200, 200),
//   50, 10,
//   {drawer, fillColor: "none"}
//   , controller
// );
// const capsule = new Capsule(  
//   new Vector(500, 350),
//   new Vector(500, 200),
//   50, 10,
//   {drawer, fillColor: "none"}
// )
// capsules.push(new Capsule(new Vector(100, 50), new Vector(100, 300), 30,2, drawer));
// capsules.push(playerCapsule);

// bodies.push(capsule);

// const box = new Box(new Vector(100, 100), new Vector(200, 100), 40, 20, {drawer, fillColor: "none"}, controller);
const box2 = new Box(new Vector(100, 300), new Vector(200, 300), 40, 20, {drawer});

bodies.push(box2);

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

function mainLoop(timeStamp: number){
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  bodies.forEach((body, index) => {
    body.move();
    body.draw();

    
    for(let bodyPair = index + 1; bodyPair < bodies.length; bodyPair++ ){
      let bestSAT: Nullable<SATResult> = {
        axis: null,
        penetration: null,
        vertex: null
      }

      for(let indexComponent1 = 0; indexComponent1 < bodies[index].components.length; indexComponent1++ ){
        for(let indexComponent2 = 0; indexComponent2 < bodies[bodyPair].components.length; indexComponent2++ ){

          const satResult = LineSegment.sat(
            bodies[index].components[indexComponent1], 
            bodies[bodyPair].components[indexComponent2]
          );

          if(!satResult) continue;
          if(Number(satResult.penetration) > Number(bestSAT.penetration)){
            bestSAT = satResult;
            ctx.fillText("COLLISION", 500, 400);
            // console.log(bestSAT);
          }
        }
      }
      
      if(bestSAT.penetration !== null && bestSAT.axis !== null){
        bestSAT.axis?.drawViewLineToThisVector(bestSAT.vertex!, bestSAT.penetration!, drawer, "blue");

        console.log("inverse masees index : " + bodies[index].inverseMass);
        console.log("inverse masees pair: " + bodies[bodyPair].inverseMass);

        let penetrationResolution = bestSAT.axis
          .mult(bestSAT.penetration / bodies[index].inverseMass + bodies[bodyPair].inverseMass);

        console.log("penetration res: " + penetrationResolution);
        
        bodies[index].components[0].position = bodies[index].components[0].position
          .add(penetrationResolution.mult(bodies[index].inverseMass));

        bodies[bodyPair].components[0].position = bodies[bodyPair].components[0].position
        .add(penetrationResolution.mult(-bodies[bodyPair].inverseMass));
      }
    }
  
  })

  requestAnimationFrame(mainLoop);
}


requestAnimationFrame(mainLoop);