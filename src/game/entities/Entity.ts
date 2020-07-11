import { Body } from 'matter-js';

export type BoundingRect = [ number, number, number, number ];

export interface Renderable {
	render(ctx: CanvasRenderingContext2D): void;
	shouldRender(rect: BoundingRect): boolean;
}

export class Entity implements Renderable {
	body: Body;

	constructor(body?: Body) {
		this.body = body || Body.create({
			isSleeping: true,
			isSensor: false,
		});
	}

	render(ctx: CanvasRenderingContext2D) {}
	shouldRender(rect: BoundingRect) {
		const { min, max } = this.body.bounds;
		return !(max.x < rect[0] || min.x > rect[2] || min.y > rect[3] || max.y < rect[1]);
	}

	update() {}
	collideWith(other: Entity) {}
}
