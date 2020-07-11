import { EntityManager } from './entities/EntityManager';
import { attachControl, getControlledTank } from './TankController';
import { TankType, createTankFromType } from './TankFactory';
import { BoundingRect } from './entities/Entity';
import { Wall } from './entities/Wall';
import { Marker, PointingArrow, Decoration } from './entities/Decorations';

// @ts-ignore: Import default level statically via parcel
import levelJson from '../../levels/l1.json';

export function loadLevel() {
	// TODO: Implement this properly
	return new Level(levelJson);
}

/**
 * Level file format:
 *  - JSON file
 * 	- Array of same length string
 *  - ' ' is nothingness
 *  - 'P' player
 *  - 'X' wall
 *  - 'M' Mobi-tank
 *  - 'A' AVG-tank
 *  - 'D' ADC-tank
 *  - 'B' mini-boss
 *  - 'F' final boss
 *  - 'C' tank garage
 *  - '+' repair pack
 *  - 'T' dummy target practice
 *  - 'K' marker
 *  - '^' up arrow
 *  - '<' left arrow
 *  - '>' right arrow
 *  - 'v' down arrow
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

		{
			const width = mapWidth * tileScale;
			const height = mapHeight * tileScale;
			// Build a border wall
			EntityManager.add(
				new Wall(width / 2 - tileScale / 2,                          0,     width,          tileScale),
				new Wall(                        0, height / 2 - tileScale / 2, tileScale,             height),
				new Wall(                    width,                 height / 2, tileScale, height + tileScale),
				new Wall(width / 2 - tileScale / 2,                     height,     width,          tileScale),
			);
		}

		for (let tileX = 0; tileX < mapWidth; tileX++) {
			for (let tileY = 0; tileY < mapHeight; tileY++) {
				const i = tileX + tileY * mapWidth;
				const x = tileX * tileScale;
				const y = tileY * tileScale;

				switch (map[i]) {
					case 'P': {
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
			if (deco.shouldRender(camAABB))
				deco.render(ctx)
		});

		// Render entities
		EntityManager.forEach(entity => {
			if (entity.shouldRender(camAABB))
				entity.render(ctx);
		});

		ctx.restore();
		ctx.fillStyle = '#fff';
		ctx.fillText(tank.body.position.x.toFixed(2) + " " + tank.body.position.y.toFixed(2), 50, 50);
	}
}
