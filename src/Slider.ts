import { Color, Vector } from "p5";
import { Point } from "./Point";
import { LineString } from "./LineString";

export class Slider extends Point {
  private pointLine: LineString;

  constructor(name: string, pointLine: LineString, color?: Color) {
    super(name, 100, 100, 20, color);
    this.pointLine = pointLine;
  }

  public override moveTo(newPosition: Vector): void {
    super.moveTo(this.pointLine.getNearestPosition(newPosition));
  }
}
