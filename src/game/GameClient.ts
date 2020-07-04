import { Timer } from './Timer';
import { engine, updateEngine } from './PhysicEngine';
import { loadLevel } from './Level';

let gameClientStarted = false;
export function runGameClient(canvas: HTMLCanvasElement) {

	(window as any).globalCanvasWidth = canvas.width;
	(window as any).globalCanvasHeight = canvas.height;

	if (gameClientStarted) {
		console.error('Game Client is already started!');
		return;
	}
	gameClientStarted = true;

	const context = canvas.getContext('2d');
	const timer = new Timer(1000 / 50);

	const level = loadLevel();

	timer.update = (deltaTime) => {
		updateEngine(deltaTime);
	}

	timer.render = () => {
		level.render(context);
	};

	level.start();
	timer.start();

	return {
		engine,
		timer,
		context,
	};
}
