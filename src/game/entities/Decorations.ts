import { Renderable, BoundingRect, Entity } from './Entity';
import { Vector, Body } from 'matter-js';
import { EntityManager } from './EntityManager';

export class Decoration implements Renderable, Vector {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	render(ctx: CanvasRenderingContext2D) {}

	shouldRender(rect: BoundingRect) {
		return rect[0] < this.x && this.x < rect[2] && rect[1] < this.y && this.y < rect[3];
	}
}

export class Marker extends Decoration {
	render(ctx: CanvasRenderingContext2D) {
		ctx.save();
		ctx.fillStyle = '#aa0';
		ctx.translate(this.x, this.y);
		ctx.rotate(Math.PI / 4);
		ctx.fillRect(-25, -5, 50, 10);
		ctx.rotate(Math.PI / 2);
		ctx.fillRect(-25, -5, 50, 10);
		ctx.restore();
	}
}

export class PointingArrow extends Decoration {
	direction: number;

	constructor(x: number, y: number, direction: string) {
		super(x, y);
		this.direction = [ 'v', '<', '^', '>' ].indexOf(direction);
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.save();
		ctx.lineWidth = 4;
		ctx.strokeStyle = '#0f0';
		ctx.translate(this.x, this.y);
		ctx.rotate(Math.PI / 2 * this.direction);
		ctx.beginPath();
		ctx.moveTo(-14, -6);
		ctx.lineTo(0, 3);
		ctx.lineTo(14, -6);
		ctx.stroke();
		ctx.restore();
	}
}

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
		ctx.strokeStyle = '#00d';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.stroke();
	}

	shouldRender(rect: BoundingRect) {
		return rect[0] < this.x && this.x < rect[2] && rect[1] < this.y && this.y < rect[3];
	}
}
