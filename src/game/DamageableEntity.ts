import { Entity } from './Entity';
import { Body } from 'matter-js';
import { EntityManager } from './EntityManager';

export class DamageableEntity extends Entity {
	health: number;
	constructor(health: number, body: Body) {
		super(body);
		this.health = health;
	}

	collideWith(other: Entity) {
		if (other.body.label === 'BULLET') {
			this.health -= (other as any).damage;
			if (this.health <= 0)
				EntityManager.scheduleRemove(this);
		}
	}
};
