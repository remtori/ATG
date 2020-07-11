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
	shouldRender(rect: BoundingRect) { return false; }

	update() {}
	collideWith(other: Entity) {}
}
