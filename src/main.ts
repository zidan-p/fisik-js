import { Ball } from './ball';
import { HTMLElementController } from './controller';
import { CanvasDrawer } from './drawer';
import './style.css'
import { NumberUtils } from './util';
import { Vector } from './vector';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const controller = new HTMLElementController(canvas);
const drawer = new CanvasDrawer(ctx);

const playerBall = new Ball(new Vector(200, 200), 30, drawer, 100, "#6ee7b7", controller);
const balls: Ball[] = [];

for(let i = 0; i < 3; i ++){
  const newObj = new Ball(
    new Vector(Math.random() * canvas.clientWidth, Math.random() * canvas.clientHeight),
    NumberUtils.getRandomInt(10, 50),
    drawer, 
    NumberUtils.getRandomInt(10, 1000), 
    "#6ee7b7"
  );

  newObj.setElascticity(NumberUtils.getRandomInt(0,3))

  balls.push(newObj);
}

balls.push(playerBall)

function mainLoop(timeStamp: number){
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);


  balls.forEach((ball, index) => {
    ball.draw();
    ball.move();

    // add collision for each ball to another
    for(let i = index + 1; i < balls.length; i++){
      if(balls[index].collisionDetection(balls[i])){ 
        balls[index].penetrationResolution(balls[i]);
        balls[index].collisionResolution(balls[i]);

      }
    }


  })

  requestAnimationFrame(mainLoop);
}


requestAnimationFrame(mainLoop);