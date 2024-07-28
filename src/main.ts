import { Ball } from './ball';
import { HTMLElementController } from './controller';
import { CanvasDrawer } from './drawer';
import './style.css'
import { Vector } from './vector';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const controller = new HTMLElementController(canvas);
const drawer = new CanvasDrawer(ctx);

const playerBall = new Ball(new Vector(200, 200), 50, drawer, undefined, controller);

function mainLoop(timeStamp: number){

  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  playerBall.move();

  playerBall.draw();

  requestAnimationFrame(mainLoop);
}


requestAnimationFrame(mainLoop);