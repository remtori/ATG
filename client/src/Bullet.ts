import { Entity } from './Entity';
import { DamageableEntity } from './DamageableEntity';
import { Vector, Bodies, Body } from 'matter-js';
import { EntityManager } from './EntityManager';

interface IBulletData {
	velocity: Vector;
	radius: number;
	color: string;
	age: number;
}

interface IBulletSetting extends IBulletData {
	position: Vector;
	health: number;
	damage: number;
}

export class Bullet extends DamageableEntity {
	data: IBulletData;
	damage: number;

	constructor({ position, damage, health, ...setting }: IBulletSetting) {
		super(
			health,
			Bodies.circle(position.x, position.y, setting.radius, {
				isSensor: true,
				label: 'BULLET',
			})
		);

		this.data = setting;
		this.damage = damage;
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(this.body.position.x, this.body.position.y, this.data.radius, 0, 2 * Math.PI);
		ctx.fillStyle = '#00f';
		ctx.fill();
	}

	update() {
		super.update();
		this.data.age -= 1;
		if (this.data.age <= 0)
			EntityManager.scheduleRemove(this);

		Body.setVelocity(this.body, this.data.velocity);
	}

	collideWith(other: Entity) {
		super.collideWith(other);
		if (other.body.label !== 'BULLET')
			EntityManager.scheduleRemove(this);
	}
}
