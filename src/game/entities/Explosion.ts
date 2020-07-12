import { Entity, BoundingRect } from './Entity';
import { EntityManager } from './EntityManager';

export class Explosion extends Entity {
	x: number;
	y: number;
	radius: number;
	maxRadius: number;

	constructor(x: number, y: number, radius: number) {
		super();
		this.x = x;
		this.y = y;
		this.radius = 0.05;
		this.maxRadius = radius;
	}

	update() {
		this.radius = this.radius * 1.1 + 0.3;
		if (this.radius > this.maxRadius) {
			EntityManager.scheduleRemove(this);
		}
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = '#d00';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.stroke();
	}

	shouldRender(rect: BoundingRect) {
		return rect[0] < this.x && this.x < rect[2] && rect[1] < this.y && this.y < rect[3];
	}
}
