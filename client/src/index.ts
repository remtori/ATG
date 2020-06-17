import { Timer } from './Timer';
import { Tank } from './Tank'
import { EntityManager } from './EntityManager';
import { width, height, engine, ctx } from './store';
import { attachControl } from './TankController';
import { Engine } from 'matter-js';

async function main() {

	const timer = new Timer(1000 / 50);

	const tank = new Tank();
	EntityManager.add(
		tank,
		new Tank(),
		new Tank(),
		new Tank(),
	);
	attachControl(tank);


	timer.update = (deltaTime) => {
		Engine.update(engine, deltaTime);
	}

	timer.render = () => {
		ctx.fillStyle = '#333';
		ctx.fillRect(0, 0, width, height);
		EntityManager.forEach(entity => entity.render(ctx));
	};

	timer.start();
}

document.addEventListener('DOMContentLoaded', main);
