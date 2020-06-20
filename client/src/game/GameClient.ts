import { Timer } from './Timer';
import { EntityManager } from './EntityManager';
import { createTankController } from './TankController';
import { createTank } from './TankFactory';
import { engine } from './PhysicEngine';
import { Engine } from 'matter-js';

let gameClientStarted = false;
export function runGameClient(canvas: HTMLCanvasElement) {

	if (gameClientStarted) {
		console.error('Game Client is already started!');
		return;
	}
	gameClientStarted = true;

	initScale(canvas);
	const attachControl = createTankController(canvas, engine);
	const context = canvas.getContext('2d');
	const timer = new Timer(1000 / 50);

	const tank = createTank();
	EntityManager.add(
		tank,
		createTank(),
		createTank(),
		createTank(),
	);
	attachControl(tank);


	timer.update = (deltaTime) => {
		Engine.update(engine, deltaTime);
	}

	timer.render = () => {
		context.fillStyle = '#333';
		context.fillRect(0, 0, canvas.width, canvas.height);
		EntityManager.forEach(entity => entity.render(context));
	};

	timer.start();
	return {
		engine,
		timer,
		context,
		attachControl,
	};
}

function initScale(cvs: HTMLCanvasElement) {
	function getActualScale() {
		return cvs.getBoundingClientRect().height / cvs.height;
	}

	(window as any).scale = getActualScale();
	window.addEventListener('resize', e => {
		(window as any).scale = getActualScale();
	});
}

