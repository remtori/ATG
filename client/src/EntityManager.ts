import { engine } from './store';
import { Entity } from './Entity';
import { Events, World } from 'matter-js';

const entities = new Map<number, Entity>();
(window as any).entities = entities;

Events.on(engine, 'beforeUpdate', () => {
	entities.forEach(entity => entity.update());
});

Events.on(engine, 'collisionStart', ({ pairs }) => {
	for (let i = 0; i < pairs.length; i++) {
		const { bodyA, bodyB } = pairs[i];
		const entityA = entities.get(bodyA.id);
		const entityB = entities.get(bodyB.id);
		entityA.collideWith(entityB);
		entityB.collideWith(entityA);
	}
});

const tobeRemoves = new Set<Entity>();
Events.on(engine, 'afterUpdate', () => {
	tobeRemoves.forEach(entity => {
		EntityManager.remove(entity);
	})
	tobeRemoves.clear();
})

export const EntityManager = {
	add(...entity: Entity[]) {
		entity.forEach(e => {
			World.add(engine.world, e.body);
			entities.set(e.body.id, e)
		});
	},
	remove(entity: Entity) {
		World.remove(engine.world, entity.body);
		entities.delete(entity.body.id);
	},
	scheduleRemove(entity: Entity) {
		tobeRemoves.add(entity);
	},
	forEach(cb: (Entity) => void) {
		entities.forEach(cb);
	}
};
