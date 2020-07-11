import { Entity, BoundingRect } from './Entity';
import { Bodies } from 'matter-js';
import { TankType } from '../TankFactory';

export class Garage extends Entity {

	currentTankType: TankType;

	constructor(x: number, y: number, tileSize: number) {
		super(Bodies.rectangle(x, y, tileSize, tileSize, {
			isSensor: true,
			label: 'TILE',
		}));

		this.currentTankType = window.selectedTankType as TankType || TankType.MOBI;
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.font = '32px Arial';
		ctx.strokeStyle = '#0f0';
		ctx.fillStyle = '#0f0';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(this.body.position.x, this.body.position.y, 25, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fillText('S', this.body.position.x - 11, this.body.position.y + 12);
	}

	collideWith(other: Entity) {
		if (other.body.label !== 'TANK')
			return;

		console.log(other);
	}
}
