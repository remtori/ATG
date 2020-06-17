import { DamageableEntity } from './DamageableEntity';
import { width, height } from './store';
import { Body, Bodies, Vector } from 'matter-js';
import { Bullet } from './Bullet';
import { EntityManager } from './EntityManager';

function clampAngle(angle: number): number {
	while (angle > 2 * Math.PI)
		angle -= 2 * Math.PI;

	while (angle < 0)
		angle += 2 * Math.PI;

	return angle;
}

interface ITankData {
	width: number;
	height: number;
	bulletSpeed: number;
	rotationSpeed: number;
	movementSpeed: number;
	shotCoolDown: number;
	coolDownSpeed: number;
	coolDownTime: number;
	barrel: {
		angle: number;
		width: number;
		height: number;
		rotationSpeed: number;
	}
}

interface ITankSetting extends ITankData {
	position: Vector;
	health: number;
}

export class Tank extends DamageableEntity {
	data: ITankData;

	constructor(settingIn: Partial<ITankSetting> = {}) {
		const setting = Object.assign({}, settingIn, {
			position: { x: width / 2, y: height / 2, },
			health: 100,
			width: 50,
			height: 30,
			rotationSpeed: 0.05,
			movementSpeed: 1.25,
			bulletSpeed: 10,
			shotCoolDown: 0,
			coolDownSpeed: 1,
			coolDownTime: 2,
			barrel: {
				angle: 0,
				width: 40,
				height: 20,
				rotationSpeed: 0.05
			}
		});
		const { position: pos, health, ...data } = setting;

		super(
			health,
			Bodies.rectangle(pos.x, pos.y, data.width, data.height, {
				density: 0.9,
				friction: 0,
				frictionStatic: 0,
				frictionAir: 0.2,
				restitution: 0,
				label: 'TANK',
			})
		);

		this.data = data;
	}

	render(ctx: CanvasRenderingContext2D) {
		const pos = this.body.position;

		ctx.save();
		ctx.translate(pos.x, pos.y);

		ctx.save();
		ctx.rotate(this.body.angle);
		ctx.fillStyle = '#090';
		ctx.fillRect(-this.data.width / 2, -this.data.height / 2, this.data.width, this.data.height);
		ctx.restore();

		ctx.save();
		ctx.rotate(this.data.barrel.angle);
		ctx.fillStyle = '#900';
		ctx.fillRect(0, -this.data.barrel.height / 2, this.data.barrel.width, this.data.barrel.height);
		ctx.restore();

		ctx.fillStyle = '#fff';
		ctx.fillText('HP: ' + this.health, 0, 0);

		ctx.restore();
	}

	update() {
		if (this.data.shotCoolDown > 0) {
			this.data.shotCoolDown -= this.data.coolDownSpeed;
			if (this.data.shotCoolDown < 0)
				this.data.shotCoolDown = 0;
		}
	}

	move(direction = 1) {
		Body.setVelocity(this.body, {
			x: Math.cos(this.body.angle) * this.data.movementSpeed * direction,
			y: Math.sin(this.body.angle) * this.data.movementSpeed * direction,
		});
	}

	rotate(direction = 1) {
		Body.setAngularVelocity(this.body, direction * this.data.rotationSpeed);
	}

	barrelTargetAngle(angle: number) {

		angle = clampAngle(angle);
		const delta = angle - this.data.barrel.angle;

		if (Math.abs(delta) <= this.data.barrel.rotationSpeed)
		{
			this.data.barrel.angle = angle;
			return;
		}

		if (delta > Math.PI ||  (- Math.PI < delta && delta < 0))
			this.data.barrel.angle -= this.data.barrel.rotationSpeed;
		else
			this.data.barrel.angle += this.data.barrel.rotationSpeed;

		this.data.barrel.angle = clampAngle(this.data.barrel.angle);
	}

	shoot() {
		if (this.data.shotCoolDown > 0)
			return;

		this.data.shotCoolDown = this.data.coolDownTime;

		const angle = this.data.barrel.angle;
		const dir = { x: Math.cos(angle), y: Math.sin(angle) };
		const posOffset = Vector.mult(dir, this.data.barrel.width);
		const position = Vector.add(this.body.position, posOffset);
		const velocity = Vector.mult(dir, this.data.bulletSpeed);

		EntityManager.add(new Bullet({
			position,
			velocity,
			age: 200,
			health: 20,
			damage: 10,
			radius: 4,
			color: '#fff',
		}));
	}
}
