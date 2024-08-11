import { Position } from "./position";



export interface Drawer{
  drawLine(startX: number, startY: number, endX: number, endY: number, color?: string): void;

  drawRectangle(
    points: [Position, Position, Position, Position],
    color?: string, 
    strokeColor?: string
  ): void;

  drawCircle(
    x: number, 
    y: number, 
    radius: number, 
    startAngle?: number, 
    /** in radian */
    endAngle?: number, 
    color?: string,
    strokeColor?: string
  ): void;

  drawCapsule(
    startX: number, 
    startY: number, 
    endX:number, 
    endY:number, 
    radius: number, 
    angle: number, 
    refAngle: number, 
    fillColor?: string, 
    strokeColor?: string
  ): void;
  fillText(text: string, x: number, y: number, color?: string): void;
}




export class CanvasDrawer implements Drawer{

  constructor(
    private readonly ctx: CanvasRenderingContext2D
  ){}

  drawRectangle(
    points: [Position, Position, Position, Position],
    color?: string, 
    strokeColor?: string
  ): void {
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    this.ctx.lineTo(points[1].x, points[1].y);
    this.ctx.lineTo(points[2].x, points[2].y);
    this.ctx.lineTo(points[3].x, points[3].y);
    this.ctx.lineTo(points[0].x, points[0].y);

    if(strokeColor !== "none"){
      this.ctx.strokeStyle = strokeColor ?? "black";
      this.ctx.stroke();
    }

    if(color !== "none"){
      this.ctx.fillStyle = color ??"red";
      this.ctx.fill();
    }
    this.ctx.closePath();

  }

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
  drawCircle(
    x: number, 
    y: number, 
    radius: number, 
    startAngle?: number, 
    endAngle?: number, 
    color?: string, 
    strokeColor?: string
  ): void {

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, startAngle ?? 0, endAngle ?? 2 * Math.PI);

    if(strokeColor !== "none"){
      this.ctx.strokeStyle = strokeColor ?? "black";
      this.ctx.stroke();
    }

    if(color !== "none"){
      this.ctx.fillStyle = color ??"red";
      this.ctx.fill();
    }
    this.ctx.closePath();
  }

  drawCapsule(
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number, 
    radius: number, 
    angle: number, 
    refAngle: number, 
    fillColor?: string, 
    strokeColor?: string
): void {
    this.ctx.beginPath();
    this.ctx.arc(startX, startY, radius, refAngle + angle +  Math.PI / 2, refAngle + angle + 3 * Math.PI / 2);
    this.ctx.arc(endX, endY, radius, refAngle + angle - Math.PI / 2, refAngle + angle + Math.PI / 2);
    this.ctx.closePath();

    if(strokeColor !== "none"){
      this.ctx.strokeStyle = strokeColor ?? "black";
      this.ctx.stroke();
    }

    if(fillColor !== "none"){
      this.ctx.fillStyle = fillColor ?? "lightGreen";
      this.ctx.fill();
    }
  }

}