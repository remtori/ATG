import { Entity, BoundingRect } from './Entity';
import { Bodies } from 'matter-js';

export class Wall extends Entity {

	x: number;
	y: number;
	w: number;
	h: number;

	constructor(x: number, y: number, w: number, h: number) {
		super(Bodies.rectangle(x, y, w, h, { isStatic: true, label: 'TILE' }));
		Object.assign(this, { x, y, w, h });
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = '#b1b3b1';
		ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
	}
}