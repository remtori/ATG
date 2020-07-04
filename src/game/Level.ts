import { EntityManager } from './EntityManager';
import { attachControl } from './TankController';
import { TankType, createTankFromType } from './TankFactory';

class LevelJSON {
	walls: Array<[ number, number, number, number ]>;
	tanks: Array<{ pos: [ number, number ], type: TankType }>;
}

export class Level extends LevelJSON {

	constructor(data: LevelJSON) {
		super();
		Object.assign(this, data);
	}

	start() {
		EntityManager.removeAll();
		this.tanks.forEach((info, index) => {
			const tank = createTankFromType(info.pos, info.type);
			EntityManager.add(tank);
			if (index === 0)
				attachControl(tank);
		});
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = '#333';
		ctx.fillRect(0, 0, globalCanvasRect.width, globalCanvasRect.height);
		EntityManager.forEach(entity => entity.render(ctx));
	}
}

// @ts-ignore: Import default level statically via parcel
import levelJson from '../../levels/l1.json';

export function loadLevel() {
	// TODO: Implement this properly
	return new Level(levelJson);
}
