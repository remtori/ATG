import { EntityManager } from './EntityManager';
import { attachControl, getControlledTank } from './TankController';
import { TankType, createTankFromType } from './TankFactory';
import { Vector } from 'matter-js';

// @ts-ignore: Import default level statically via parcel
import levelJson from '../../levels/l1.json';
import { Wall } from './Entities';

export function loadLevel() {
	// TODO: Implement this properly
	return new Level(levelJson);
}

interface LevelData {
	map: string[];
	tanks: Array<{ pos: [ number, number ], type: TankType }>;
}

export class Level {

	levelData: LevelData;

	constructor(data: LevelData) {
		this.levelData = data;
	}

	start() {
		EntityManager.removeAll();

		this.levelData.tanks.forEach((info, index) => {
			const tank = createTankFromType(info.pos, info.type);
			EntityManager.add(tank);
			if (index === 0)
				attachControl(tank);
		});

		this.levelData.walls.forEach(wd => EntityManager.add(new Wall(wd)));
	}

	render(ctx: CanvasRenderingContext2D) {

		// Setup camera
		const tank = getControlledTank()!;
		const { x: camX, y: camY } = tank.body.position;
		const camWidth = globalCanvasWidth;
		const camHeight = globalCanvasHeight;
		const camAABB: BoundingRect = [
			camX - camWidth  / 2 - 50,
			camY - camHeight / 2 - 50,
			camX + camWidth  / 2 + 50,
			camY + camHeight / 2 + 50,
		];

		// Background
		ctx.fillStyle = '#333';
		ctx.fillRect(0, 0, camWidth, camHeight);

		ctx.save();
		ctx.translate(-camX + camWidth / 2, -camY + camHeight / 2);

		// Render entities
		EntityManager.forEach(entity => {
			if (inRect(entity.body.position, camAABB))
				entity.render(ctx);
		});

		ctx.restore();
	}
}

type BoundingRect = [ number, number, number, number ];

function inRect(pos: Vector, rect: BoundingRect) {
	return rect[0] < pos.x && pos.x < rect[2] && rect[1] < pos.y && pos.y < rect[3];
}