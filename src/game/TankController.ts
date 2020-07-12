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
let reSpawnPointX = 0;
let reSpawnPointY = 0;

let initialized = false;
function init() {
	initialized = true;

	window.addEventListener('keydown', e => {
		keys[e.code] = true;
	});
	window.addEventListener('keyup', e => {
		keys[e.code] = false;
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

		if (tank.isInGarage) {

			reSpawnPointX = tank.body.position.x;
			reSpawnPointY = tank.body.position.y;

			if (keys['Space']) {
				route(Scene.TankPicker);
				return;
			}
		}

		if (keys['ShiftLeft']) {
			tank.speed = tank.stats.tank.movementSpeed * 1.75;
			tank.accuracy = tank.stats.barrel.accuracy * 0.5;
		} else {
			tank.speed = tank.stats.tank.movementSpeed;
			tank.accuracy = tank.stats.barrel.accuracy;
		}

		if (keys['KeyW'])
			tank.move(1);
		else if (keys['KeyS'])
			tank.move(-1);

		if (keys['KeyA'])
			tank.rotate(-1);
		else if (keys['KeyD'])
			tank.rotate(1);

		// const pos = tank.body.position;
		tank.barrelTargetAngle(Math.atan((mY - pos.y) / (mX - pos.x)) + Math.PI * (mX < pos.x ? 1 : 2));

		if (mouseDown)
			tank.shoot();
	});
}

function onDeath() {
	const newTank = createTankFromType(reSpawnPointX, reSpawnPointY, selectedTankType as TankType);
	EntityManager.remove(tank);
	EntityManager.add(newTank);
	attachControl(newTank);
	Level.current.deathCount++;
}

export function attachControl(tankIn: Tank) {
	if (!initialized) init();
	tank = tankIn;
	tank.beforeDeath = onDeath;
}

// TODO: Change this hack
export function changeTankType(tankType: TankType) {
	if (!tank) return;
	const newTank = createTankFromType(tank.body.position.x , tank.body.position.y, tankType, {
		angle: tank.body.angle
	});
	newTank.barrelAngle = tank.barrelAngle;

	EntityManager.remove(tank);
	EntityManager.add(newTank);
	attachControl(newTank);
}
