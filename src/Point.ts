import { Color, Vector } from "p5";
import { ctx } from ".";

const TEXT_OFFSET = 10;
export class Point {
  public position: Vector;

  public name: string;
  private size: number;
  private color: Color;

  constructor(name: string, x: number, y: number, size: number, color?: Color) {
    this.name = name;
    this.position = new Vector(x, y);
    this.size = size;
    this.color = color ?? ctx.color(0, 0, 255);
  }

  public draw(): void {
    ctx.push();
    ctx.translate(this.position.x, this.position.y);
    ctx.fill(this.color);
    ctx.ellipse(0, 0, this.size);
    ctx.fill(0, 0, 0);
    ctx.textSize(10);
    ctx.text(`${this.name} (${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)})`, TEXT_OFFSET, 0);
    ctx.pop();
  }

  public moveTo(newPosition: Vector): void {
    this.position = newPosition;
  }

  public isClickedOn(clickedPosition: Vector): boolean {
    return (
      this.position.x - this.size / 2 < clickedPosition.x &&
      this.position.x + this.size / 2 > clickedPosition.x &&
      this.position.y - this.size / 2 < clickedPosition.y &&
      this.position.y + this.size / 2 > clickedPosition.y
    );
  }
}
