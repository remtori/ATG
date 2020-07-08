import { Body, Bodies } from 'matter-js';

export interface Renderable {
	render(ctx: CanvasRenderingContext2D): void;
}

export class Entity implements Renderable {
	body: Body;

	constructor(body: Body) {
		this.body = body;
	}

	render(ctx: CanvasRenderingContext2D) {}
	update() {}
	collideWith(other: Entity) {}
}
