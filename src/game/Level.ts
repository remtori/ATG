import { EntityManager } from './EntityManager';
import { attachControl, getControlledTank } from './TankController';
import { TankType, createTankFromType } from './TankFactory';
import { Vector } from 'matter-js';

// @ts-ignore: Import default level statically via parcel
import levelJson from '../../levels/l1.json';
import { Wall } from './Wall';
import { Marker, PointingArrow, Decoration } from './Decorations';

export function loadLevel() {
	// TODO: Implement this properly
	return new Level(levelJson);
}

/**
 * Level file format:
 *  - JSON file
 * 	- Array of same length string
 *  - ' ' is nothingness
 *  - 'P' is a player
 *  - 'X' is a wall
 *  - 'M' is a Mobi-tank
 *  - 'A' is a AVG-tank
 *  - 'D' is a ADC-tank
 *  - 'B' is a mini-boss
 *  - 'F' is a final boss
 *  - '+' is a repair pack
 *  - 'T' is a dummy target practice
 *  - 'K' is a marker
 *  - '^' is a up arrow
 *  - '<' is a left arrow
 *  - '>' is a right arrow
 *  - 'v' is a down arrow
 */
type LevelData = string[];

export class Level {

	levelData: LevelData;
	decorations: Decoration[];

	constructor(data: LevelData) {
		this.levelData = data;
		this.decorations = [];
	}

	start() {
		EntityManager.removeAll();
		this.decorations.length = 0;

		const mapWidth = this.levelData[0].length;
		const mapHeight = this.levelData.length;
		const map = this.levelData.join('');
		const tileScale = 50;

		for (let tileX = 0; tileX < mapWidth; tileX++) {
			for (let tileY = 0; tileY < mapHeight; tileY++) {
				const i = tileX + tileY * mapWidth;
				const x = tileX * tileScale;
				const y = tileY * tileScale;

				switch (map[i]) {
					case 'P': {
						// TODO: get the selected type of tank
						const tank = createTankFromType(x, y, TankType.MOBI);
						EntityManager.add(tank);
						attachControl(tank);
						break;
					}
					case 'X':
						EntityManager.add(new Wall(x, y, tileScale, tileScale));
						break;
					case 'M':
					case 'A':
					case 'D': {
						EntityManager.add(createTankFromType(x, y, map[i] as TankType));
						// TODO: Attach AI
						break;
					}
					case 'B':
						// TODO: Create the mini-boss
						break;
					case 'F':
						// TODO: Create the final-boss
						break;
					case '+':
						// TODO: Spawn the repair pack
						break;
					case 'T': {
						const tank = createTankFromType(x, y, TankType.AVG);
						tank.body.label = 'TARGET_DUMMY';
						EntityManager.add(tank);
						break;
					}
					case 'K':
						this.decorations.push(new Marker(x, y));
						break;
					case '^':
					case 'v':
					case '<':
					case '>':
						this.decorations.push(new PointingArrow(x, y, map[i]));
						break;
				}
			}
		}
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

		this.decorations.forEach(deco => {
			if (inRect(deco, camAABB))
				deco.render(ctx)
		});

		// Render entities
		EntityManager.forEach(entity => {
			if (inRect(entity.body.position, camAABB))
				entity.render(ctx);
		});

		ctx.restore();
		ctx.fillStyle = '#fff';
		ctx.fillText(tank.body.position.x.toFixed(2) + " " + tank.body.position.y.toFixed(2), 50, 50);
	}
}

type BoundingRect = [ number, number, number, number ];

function inRect(pos: Vector, rect: BoundingRect) {
	return rect[0] < pos.x && pos.x < rect[2] && rect[1] < pos.y && pos.y < rect[3];
}