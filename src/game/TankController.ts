import { Tank } from './entities/Tank';
import { Events, Engine } from 'matter-js';
import { engine } from './PhysicEngine';
import { TankType, createTankFromType } from './TankFactory';
import { Level } from './Level';
import { route, getCurrentUrl } from 'preact-router';
import { Scene } from '../components/routes';
import { EntityManager } from './entities/EntityManager';

let tank: Tank | undefined;

export function getControlledTank() {
	return tank;
}

(window as any).getControlledTank = getControlledTank;

const keys: { [key: string]: boolean } = {};
let mX = 0;
let mY = 0;

let initialized = false;
function init() {
	initialized = true;

	window.addEventListener('keydown', e => {
		keys[e.key] = true;
	});
	window.addEventListener('keyup', e => {
		keys[e.key] = false;
	});

	window.addEventListener('mousemove', e => {
		mX = (e.pageX - globalCanvasRect.x) * (globalCanvasWidth / globalCanvasRect.width);
		mY = (e.pageY - globalCanvasRect.y) * (globalCanvasHeight / globalCanvasRect.height);
	});

	let mouseDown = false;
	window.addEventListener('mousedown', e => {
		if (e.button === 0)
			mouseDown = true;
	});
	window.addEventListener('mouseup', e => {
		if (e.button === 0)
			mouseDown = false;
	})

	const pos = { x: globalCanvasWidth / 2, y: globalCanvasHeight / 2 };
	Events.on(engine, "beforeUpdate", e => {
		if (!tank || getCurrentUrl() === Scene.TankPicker) return;

		if (keys[' '] && Level.current.getTileAt(tank.body.position.x, tank.body.position.y) === 'C') {
			route(Scene.TankPicker);
			return;
		}

		if (keys['w'])
			tank.move(1);
		else if (keys['s'])
			tank.move(-1);

		if (keys['a'])
			tank.rotate(-1);
		else if (keys['d'])
			tank.rotate(1);

		// const pos = tank.body.position;
		tank.barrelTargetAngle(Math.atan((mY - pos.y) / (mX - pos.x)) + Math.PI * (mX < pos.x ? 1 : 2));

		if (mouseDown)
			tank.shoot();
	});
}

function onDeath() {
	Level.current.start();
}

export function attachControl(tankIn: Tank) {
	if (!initialized) init();
	tank = tankIn;
	tank.beforeDeath = onDeath;
}

// TODO: Change this hack
export function changeTankType(tankType: TankType) {
	if (!tank) return;
	const newTank = createTankFromType(tank.body.position.x , tank.body.position.y, tankType);
	newTank.barrelAngle = tank.barrelAngle;
	newTank.body.angle = tank.body.angle;

	EntityManager.remove(tank);
	EntityManager.add(newTank);
	attachControl(newTank);
}
