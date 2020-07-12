import { Tank } from "./entities/Tank";
import { Events, Vector } from "matter-js";
import { engine } from "./PhysicEngine";
import { getControlledTank } from "./TankController";

let controlledMobs: Tank[] = [];
export function attachMobControl(tank: Tank) {
	controlledMobs.push(tank);
}

Events.on(engine, 'beforeUpdate', function() {
	const enemy = getControlledTank();

	for (const tank of controlledMobs) {
		const dir = Vector.sub(enemy.body.position, tank.body.position);
		const angle = Math.atan((dir.y) / (dir.x)) + Math.PI * (dir.x < 0 ? 1 : 2);
		tank.bodyTargetAngle(angle);
		tank.barrelTargetAngle(angle);

		const sqrDist = dir.x * dir.x + dir.y * dir.y;

		if (sqrDist > 1000 * 1000)
			continue;

		if (sqrDist > 200 * 200)
			tank.move();

		if (sqrDist < 500 * 500)
			tank.shoot();
	}
});
