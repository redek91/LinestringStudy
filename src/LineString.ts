import { Vector } from "p5";
import { Line } from "./Line";
import { Point } from "./Point";

export class LineString {
  private lines: Line[];
  public activePoint?: Point;

  constructor(...points: Point[]) {
    this.lines = [];

    for (let i = 0; i < points.length - 1; i++) {
      this.lines.push(new Line(points[i], points[i + 1]));
    }
  }

  public getPoints(): Point[] {
    let points: Point[] = [];
    this.lines.forEach((line) => {
      points.push(...line.getPoints());
    });

    // Remove duplicates
    return Array.from(new Set(points));
  }

  public draw(): void {
    this.lines.forEach((line) => {
      line.draw();
    });
  }

  public getLength(): number {
    let length = 0;

    this.lines.forEach((line) => {
      length += line.getLength();
    });

    return length;
  }

  public getNearestPosition(position: Vector): Vector {
    let currentLineF = this.lines[0].getLineFunction();
    let slope = currentLineF.slope;
    let offset = currentLineF.offset;
    let nearestPoint = new Vector(position.x, slope * position.x + offset);
    let nearestDistance = Vector.dist(position, nearestPoint);

    for (let i = 1; i < this.lines.length; i++) {
      currentLineF = this.lines[i].getLineFunction();
      slope = currentLineF.slope;
      offset = currentLineF.offset;
      const currentPoint = new Vector(position.x, slope * position.x + offset);
      const currentDistance = Vector.dist(position, currentPoint);

      if (currentDistance < nearestDistance) {
        nearestDistance = currentDistance;
        nearestPoint = currentPoint;
      }
    }

    return nearestPoint;
  }
}
