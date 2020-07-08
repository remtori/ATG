import { Entity } from './Entity';
import { Bodies } from 'matter-js';

export class Wall extends Entity {

	constructor(tileX: number, tileY: number, tileWidth = 1, tileHeight = 1) {
		super(Bodies.rectangle(
			tileX * 100, tileY * 100, 100 * tileWidth, 100 * tileHeight,
			{ isStatic: true }
		));
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.fillRect(this.body.position.x, this.body.position.y, 100, 100);
	}
}