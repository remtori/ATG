import { Renderable } from './Entity';
import { Vector } from 'matter-js';

export class Decoration implements Renderable, Vector {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	render(ctx: CanvasRenderingContext2D) {}
}

export class Marker extends Decoration {
	x: number;
	y: number;

	render(ctx: CanvasRenderingContext2D) {
		ctx.save();
		ctx.fillStyle = '#f00';
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
