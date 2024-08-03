import { Ball } from './ball';
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

// -- capsules --
const capsules: Capsule[] = [];
const playerCapsule = new Capsule(
  new Vector(200, 300),
  new Vector(400, 200),
  20, 10,
  drawer, controller
);
capsules.push(new Capsule(new Vector(100, 50), new Vector(100, 300), 30,2, drawer));
capsules.push(playerCapsule);


function mainLoop(timeStamp: number){
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);


  // drawe balls
  // balls.forEach((ball, index) => {
  //   ball.draw();
  //   ball.move();

  //   // add collision for each ball to another
  //   for(let i = index + 1; i < balls.length; i++){
  //     if(balls[index].collisionDetection(balls[i])){ 
  //       balls[index].penetrationResolution(balls[i]);
  //       balls[index].collisionResolution(balls[i]);
  //     }
  //   }

  //   // add collision ball and wall

  //   walls.forEach(w => {
  //     if(w.collisionDetectionBallAndWall(ball)){
  //       w.penetrationResolutionBallAndWall(ball);
  //       w.collisionResolutionBallAndWall(ball);
  //     }
  //     w.draw();
  //   })

  // });

  
  walls.forEach(w => {
    w.move();
    w.draw()
  })
  
  // console.log(capsules[0].position);
  // draw capsules
  capsules.forEach((c, index) => {
    c.move()
    c.draw()

    // add collision
    for (let i = index + 1; i < capsules.length; i++) {
      if(c.collisionDetectionBetweenCapsules(capsules[i])){
        ctx.fillText("Collide", 500, 400);
        Capsule.penetrationResolutionBetweenCapsules(capsules[index], capsules[i])
        Capsule.collisionResolutionBetweenCapsules(capsules[index], capsules[i])
        // c.penetrationResolutionBetweenCapsules(capsules[i]);
        // c.collisionResolutionBetweenCapsules(capsules[i]);
      }
    }
  })

  // drae helper
  LineSegment.previewClosesPoint(drawer, capsules[0], capsules[1]);

  // // draw distance wall
  // walls[0].closestPosintBallandWall(playerBall)
  //   .subtr(playerBall.getPosition())
  //   .drawViewLineToThisVector(playerBall.getPosition(), 1, drawer, "#831843");


  requestAnimationFrame(mainLoop);
}


requestAnimationFrame(mainLoop);