import "./styles/index.scss";
import { Point } from "./Point";
import p5, { Vector } from "p5";
import { LineString } from "./LineString";
import { Slider } from "./Slider";

const WIDTH = 600;
const HEIGHT = 600;
class Sketch extends p5 {
  private lineString!: LineString;
  private slider!: Slider;
  private activePoint?: Point;

  constructor() {
    super(() => {});
  }

  override setup(): void {
    this.createCanvas(600, 600);

    this.lineString = new LineString(
      new Point("A", 100, 100, 10),
      new Point("B", 200, 200, 10),
      new Point("C", 300, 300, 10),
      new Point("D", 400, 400, 10),
      new Point("E", 500, 500, 10)
    );

    this.slider = new Slider("Slider", this.lineString, this.color(125, 10, 200));
    this.noStroke();
  }

  override draw(): void {
    this.background(255);
    this.lineString.draw();
    this.slider.draw();
    this.textSize(20);
    this.text(`Total length: ${this.lineString.getLength().toFixed(0)}`, 20, HEIGHT - 20);
  }

  override mousePressed(event: MouseEvent): void {
    const position = new Vector(event.offsetX, event.offsetY);
    if (!this.checkSliderClicked(position)) {
      this.checkPointsOnLineStringClicked(position);
    }
  }

  override mouseDragged(event: MouseEvent): void {
    this.activePoint?.moveTo(new Vector(event.offsetX, event.offsetY));
  }

  override mouseReleased(event: MouseEvent): void {
    this.activePoint = undefined;
  }

  private checkSliderClicked(position: Vector): boolean {
    if (this.slider.isClickedOn(position)) {
      this.activePoint = this.slider;
      console.log("Moving slider");
      return true;
    }
    return false;
  }

  private checkPointsOnLineStringClicked(position: Vector): void {
    const points = this.lineString.getPoints();
    points.forEach((point) => {
      if (point.isClickedOn(position)) {
        this.activePoint = point;
        console.log("Moving point on linestring.");
      }
    });
  }
}

const ctx = new Sketch();

export { ctx };
