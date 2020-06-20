import { DamageableEntity } from './DamageableEntity';
import { Body, Bodies, Vector } from 'matter-js';
import { TankShell, TankShellStats } from './TankShell';
import { EntityManager } from './EntityManager';

const twoPI = Math.PI * 2;
function clampAngle(angle: number): number {
	return ((angle % twoPI) + twoPI) % twoPI;
}

interface TankStats {
	shell: TankShellStats;
	tank: {
		width: number;
		length: number;
		health: number;
		rotationSpeed: number;
		movementSpeed: number;
		color: string;
	};
	barrel: {
		width: number;
		length: number;
		recoilMultiplier: number;
		accuracy: number;
		rotationSpeed: number;
		cdTime: number;
		cdSpeed: number;
		color: string;
	}
}

export class Tank extends DamageableEntity {
	stats: TankStats;
	cooldown: number = 0;
	barrelAngle: number = 0;

	constructor(position: Vector, stats: TankStats) {
		super(
			stats.tank.health,
			Bodies.rectangle(position.x, position.y, stats.tank.length, stats.tank.width, {
				density: 1,
				friction: 0,
				frictionStatic: 0,
				frictionAir: 0.2,
				restitution: 0,
				label: 'TANK',
			})
		);

		this.stats = stats;
		console.log(stats);
	}

	render(ctx: CanvasRenderingContext2D) {
		const pos = this.body.position;

		ctx.save();
		ctx.translate(pos.x, pos.y);

		ctx.save();
		ctx.rotate(this.body.angle);
		ctx.fillStyle = '#090';
		ctx.fillRect(-this.stats.tank.length / 2, -this.stats.tank.width / 2, this.stats.tank.length, this.stats.tank.width);
		ctx.restore();

		ctx.save();
		ctx.rotate(this.barrelAngle);
		ctx.fillStyle = '#900';
		ctx.fillRect(0, -this.stats.barrel.width / 2, this.stats.barrel.length, this.stats.barrel.width);
		ctx.restore();

		ctx.fillStyle = '#fff';
		ctx.fillText('HP: ' + this.health, 0, 0);

		ctx.restore();
	}

	update() {
		if (this.cooldown > 0) {
			this.cooldown -= this.stats.barrel.cdSpeed;
			if (this.cooldown < 0)
				this.cooldown = 0;
		}
	}

	move(direction = 1) {
		Body.applyForce(this.body, this.body.position, {
			x: Math.cos(this.body.angle) * this.stats.tank.movementSpeed * direction,
			y: Math.sin(this.body.angle) * this.stats.tank.movementSpeed * direction,
		});
	}

	rotate(direction = 1) {
		Body.setAngularVelocity(this.body, direction * this.stats.tank.rotationSpeed);
	}

	barrelTargetAngle(angle: number) {

		angle = clampAngle(angle);
		const delta = angle - this.barrelAngle;

		if (Math.abs(delta) <= this.stats.barrel.rotationSpeed)
		{
			this.barrelAngle = angle;
			return;
		}

		if (delta > Math.PI ||  (- Math.PI < delta && delta < 0))
			this.barrelAngle -= this.stats.barrel.rotationSpeed;
		else
			this.barrelAngle += this.stats.barrel.rotationSpeed;

		this.barrelAngle = clampAngle(this.barrelAngle);
	}

	shoot() {
		if (this.cooldown > 0)
			return;

		this.cooldown = this.stats.barrel.cdTime;

		const angle = this.barrelAngle + ((1 - Math.random() * 2) * (1 - this.stats.barrel.accuracy));
		const dir = { x: Math.cos(angle), y: Math.sin(angle) };

		const posOffset = Vector.mult(dir, this.stats.barrel.length);
		const position = Vector.add(this.body.position, posOffset);
		const velocity = Vector.mult(dir, this.stats.shell.speed);

		const recoilForce = Vector.mult(velocity, this.stats.barrel.recoilMultiplier);
		Body.applyForce(
			this.body, this.body.position,
			Vector.mult(recoilForce, (Math.abs(Math.cos(this.body.angle - angle)) + 0.01)),
		);

		EntityManager.add(new TankShell(position, velocity, this.stats.shell));
	}
}
