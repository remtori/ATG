import { Body } from 'matter-js';

export type BoundingRect = [ number, number, number, number ];

export interface Renderable {
	render(ctx: CanvasRenderingContext2D): void;
	shouldRender(rect: BoundingRect): boolean;
}

const EMPTY_BODY = Body.create({});
export class Entity implements Renderable {
	body: Body;

	constructor(body: Body = EMPTY_BODY) {
		this.body = body;
	}

	render(ctx: CanvasRenderingContext2D) {}
	shouldRender(rect: BoundingRect) { return false; }

	update() {}
	collideWith(other: Entity) {}
}
