import './style.css'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;


function mainLoop(timeStamp: number){

  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  requestAnimationFrame(mainLoop);
}


requestAnimationFrame(mainLoop);