import { Entity, BoundingRect } from './Entity';
import { DamageableEntity } from '../DamageableEntity';
import { Vector, Bodies, Body } from 'matter-js';
import { EntityManager } from './EntityManager';
import { Explosion } from './Explosion';

export interface TankShellStats {
	hasImpact: boolean;
	speed: number;
	radius: number;
	health: number;
	damage: number;
	age: number;
}

export class TankShell extends DamageableEntity {
	stats: TankShellStats;
	velocity: Vector;
	damage: number;
	age: number;

	constructor(position: Vector, velocity: Vector, stats: TankShellStats) {
		super(
			stats.health,
			Bodies.circle(position.x, position.y, stats.radius, {
				label: 'BULLET',
				isSensor: !stats.hasImpact,
				density: 1e-6,
			})
		);

		this.stats = stats;
		this.velocity = velocity;
		this.damage = stats.damage;
		this.age = stats.age;
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(this.body.position.x, this.body.position.y, this.stats.radius, 0, 2 * Math.PI);
		ctx.fillStyle = '#00f';
		ctx.fill();
	}

	update() {
		super.update();
		this.age -= 1;
		if (this.age <= 0) {
			EntityManager.scheduleRemove(this);
		}

		Body.setVelocity(this.body, this.velocity);
	}

	collideWith(other: Entity) {
		super.collideWith(other);
		if (other.body.label !== 'BULLET') {
			EntityManager.add(
				new Explosion(this.body.position.x, this.body.position.y, this.stats.radius)
			);
			EntityManager.scheduleRemove(this);
		}
	}
}
