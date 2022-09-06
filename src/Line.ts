import { Color, Vector } from "p5";
import { ctx } from ".";
import { Point } from "./Point";

export class Line {
  private p1: Point;
  private p2: Point;
  private color: Color;

  constructor(p1: Point, p2: Point, color?: Color) {
    this.p1 = p1;
    this.p2 = p2;
    this.color = color ?? ctx.color(0, 0, 0);
  }

  public draw(): void {
    this.p1.draw();
    this.p2.draw();
    ctx.stroke(this.color);
    ctx.line(this.p1.position.x, this.p1.position.y, this.p2.position.x, this.p2.position.y);

    const pointBetweenPoints = Vector.lerp(this.p1.position, this.p2.position, 0.5);
    const differentialVector = Vector.sub(this.p2.position, this.p1.position);
    const distance = this.getLength().toFixed(0);
    ctx.push();
    ctx.translate(pointBetweenPoints.x, pointBetweenPoints.y);
    ctx.rotate(differentialVector.heading());

    ctx.textSize(10);
    ctx.text(`${this.p1.name}${this.p2.name} = ${distance}`, 0, -2);
    ctx.rotate(-Vector.dot(this.p1.position, this.p2.position));
    ctx.pop();
  }

  public getLineFunction(): { slope: number; offset: number } {
    const x1 = this.p1.position.x;
    const x2 = this.p2.position.x;
    const y1 = this.p1.position.y;
    const y2 = this.p2.position.y;
    const slope = (y2 - y1) / (x2 - x1);
    const offset = y1 - slope * x1;

    return { slope, offset };
  }

  public getLength(): number {
    return this.p1.position.dist(this.p2.position);
  }

  public getPoints(): Point[] {
    return [this.p1, this.p2];
  }
}
