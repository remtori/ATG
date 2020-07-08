import { Body, Vector, World } from 'matter-js';
import { engine } from './PhysicEngine';

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
