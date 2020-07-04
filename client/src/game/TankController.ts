import { Tank } from './Tank';
import { Events, Engine } from 'matter-js';

let tank: Tank | undefined;

export function getControlledTank() {
	return tank;
}

export function createTankController(canvas: HTMLCanvasElement, engine: Engine) {
	const keys: { [key: string]: boolean } = {};
	window.addEventListener('keydown', e => {
		keys[e.key] = true;
	});
	window.addEventListener('keyup', e => {
		keys[e.key] = false;
	});

	let mX = 0;
	let mY = 0;
	window.addEventListener('mousemove', e => {
		mX = (e.pageX - globalCanvasRect.x) * (canvas.width / globalCanvasRect.width);
		mY = (e.pageY - globalCanvasRect.y) * (canvas.height / globalCanvasRect.height);
	});

	let mouseDown = false;
	canvas.addEventListener('mousedown', e => {
		if (e.button === 0)
			mouseDown = true;
	});
	window.addEventListener('mouseup', e => {
		if (e.button === 0)
			mouseDown = false;
	})

	Events.on(engine, "beforeUpdate", e => {
		if (!tank) return;

		if (keys['w'])
			tank.move(1);
		else if (keys['s'])
			tank.move(-1);

		if (keys['a'])
			tank.rotate(-1);
		else if (keys['d'])
			tank.rotate(1);

		const pos = tank.body.position;
		tank.barrelTargetAngle(Math.atan((mY - pos.y) / (mX - pos.x)) + Math.PI * (mX < pos.x ? 1 : 2));

		if (mouseDown)
			tank.shoot();
	});

	return function attachControl(tankIn: Tank) {
		tank = tankIn;
	}
}
