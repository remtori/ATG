import { Body } from 'matter-js';

export interface IRenderable {
	render(ctx: CanvasRenderingContext2D): void;
}

export class Entity implements IRenderable {
	body: Body;

	constructor(body: Body) {
		this.body = body;
	}

	render(ctx: CanvasRenderingContext2D) {}
	update() {}
	collideWith(other: Entity) {}
}
