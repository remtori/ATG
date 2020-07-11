import { Entity, BoundingRect } from './Entity';
import { Bodies } from 'matter-js';

export class Wall extends Entity {

	x: number;
	y: number;
	w: number;
	h: number;
	boundingRect: BoundingRect;

	constructor(x: number, y: number, w: number, h: number) {
		super(Bodies.rectangle(x, y, w, h, { isStatic: true }));
		Object.assign(this, { x, y, w, h });
		this.boundingRect = [
			x - w / 2,
			y - h / 2,
			x + w / 2,
			y + h / 2,
		];
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = '#b1b3b1';
		ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
	}

	shouldRender(rect: BoundingRect) {
		return !(this.boundingRect[2] < rect[0] || this.boundingRect[0] > this.boundingRect[2] || this.boundingRect[1] > rect[3] || this.boundingRect[3] < rect[1]);
	}
}