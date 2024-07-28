


export interface Drawer{
  drawLine(startX: number, startY: number, endX: number, endY: number, color?: string): void;
  drawCircle(x: number, y: number, radius: number, color?: string): void;
  fillText(text: string, x: number, y: number, color?: string): void;
}




export class CanvasDrawer implements Drawer{

  constructor(
    private readonly ctx: CanvasRenderingContext2D
  ){}
  fillText(text: string, x: number, y: number, color?: string): void {
    this.ctx.fillStyle = color ?? "black";
    this.ctx.fillText(text, x, y);
  }
  drawLine(startX: number, startY: number, endX: number, endY: number, color?: string): void {
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = color ?? "blue";
    this.ctx.stroke();
    this.ctx.closePath()
  }
  drawCircle(x: number, y: number, radius: number, color?: string): void {

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
    this.ctx.fillStyle = color ??"red";
    this.ctx.fill();
    this.ctx.closePath();
  }

}