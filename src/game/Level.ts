import { EntityManager } from './entities/EntityManager';
import { attachControl, getControlledTank } from './TankController';
import { TankType, createTankFromType } from './TankFactory';
import { BoundingRect } from './entities/Entity';
import { Wall } from './entities/Wall';
import { Marker, PointingArrow, Decoration, Garage } from './entities/Decorations';
import { attachMobControl } from './MobController';

// @ts-ignore: Import default level statically via parcel
import levelJson from '../../levels/l1.json';
import { route, getCurrentUrl } from 'preact-router';
import { Scene } from '../components/routes';

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

// TODO: We can do better than this
function getRenderOrder(label: string): number {
	switch(label) {
		case 'TILE':
			return 1;
		case 'DECORATION':
			return 2;
		case 'TANK':
			return 3;
		default:
			return 5;
	}
}

export class Level {

	static current: Level | undefined;
	levelData: LevelData;
	decorations: Decoration[];
	deathCount: number = 0;
	startTime: number;

	constructor(data: LevelData) {
		this.levelData = data;
		this.decorations = [];
	}

	start() {
		route(Scene.Tutorial);
		this.startTime = Date.now();
		Level.current = this;
		EntityManager.removeAll();
		this.decorations = [];

		const mapWidth = this.levelData[0].length;
		const mapHeight = this.levelData.length;
		const map = this.levelData.join('');
		const tileScale = 50;

		{
			const width = mapWidth * tileScale;
			const height = mapHeight * tileScale;
			// Build a border wall
			EntityManager.add(
				new Wall(        width / 2, -tileScale, width + tileScale * 3,          tileScale),
				new Wall(       -tileScale, height / 2,             tileScale, height + tileScale),
				new Wall(            width, height / 2,             tileScale, height + tileScale),
				new Wall(        width / 2, height    , width + tileScale * 3,          tileScale),
			);
		}

		for (let tileX = 0; tileX < mapWidth; tileX++) {
			for (let tileY = 0; tileY < mapHeight; tileY++) {
				const i = tileX + tileY * mapWidth;
				const x = tileX * tileScale;
				const y = tileY * tileScale;

				switch (map[i]) {
					case 'P': {
						const tank = createTankFromType(x, y, window.selectedTankType as TankType);
						EntityManager.add(tank);
						attachControl(tank);
						break;
					}
					case 'X':
						EntityManager.add(new Wall(x, y, tileScale, tileScale));
						break;
					case 'M':
					case 'A':
					case 'D':
					case 'B':
					case 'F': {
						const tank = createTankFromType(x, y, map[i] as TankType);
						EntityManager.add(tank);
						attachMobControl(tank);
						break;
					}
					case 'C':
						this.decorations.push(new Garage(x, y));
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

	getTileAt(x: number, y: number) {
		return this.levelData[Math.floor((y + 25) / 50)][Math.floor((x + 25) / 50)];
	}

	render(ctx: CanvasRenderingContext2D) {

		if (getCurrentUrl() === Scene.Victory) {
			ctx.fillStyle = '#f5b342';
			ctx.textAlign = 'center';
			ctx.font = '56px Arial';
			ctx.fillText('You Win!', globalCanvasWidth / 2, globalCanvasHeight / 2);
			return;
		}

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
		// TODO: Fix these
		const entities = Array.from(EntityManager.list());
		entities
		.sort((a, b) => {
			return getRenderOrder(a.body.label) - getRenderOrder(b.body.label);
		})
		.forEach(
			entity => entity.shouldRender(camAABB) && entity.render(ctx)
		);

		ctx.restore();

		ctx.fillStyle = '#fff';
		ctx.font = '24px Courier';
		ctx.fillText(`Death Count: ${this.deathCount}`, 0, 24);
		ctx.fillText(`Play time  : ${((Date.now() - this.startTime) / 1000).toFixed(2)}`, 0, 48);
	}
}
