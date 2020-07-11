import { DamageableEntity } from '../DamageableEntity';
import { Body, Bodies, Vector } from 'matter-js';
import { TankShell, TankShellStats } from './TankShell';
import { EntityManager } from './EntityManager';
import { BoundingRect, Entity } from './Entity';

const twoPI = Math.PI * 2;
function clampAngle(angle: number): number {
	return ((angle % twoPI) + twoPI) % twoPI;
}

export interface TankStats {
	shell: TankShellStats;
	tank: {
		width: number;
		length: number;
		health: number;
		rotationSpeed: number;
		movementSpeed: number;
	};
	barrel: {
		width: number;
		length: number;
		recoilMultiplier: number;
		accuracy: number;
		rotationSpeed: number;
		cdTime: number;
		cdSpeed: number;
	}
}

export class Tank extends DamageableEntity {
	stats: TankStats;
	cooldown: number = 0;
	barrelAngle: number = 0;

	constructor(x: number, y: number, stats: TankStats) {
		super(
			stats.tank.health,
			Bodies.rectangle(x, y, stats.tank.length, stats.tank.width, {
				density: 1,
				friction: 0,
				frictionStatic: 0,
				frictionAir: 0.2,
				restitution: 0,
				label: 'TANK',
			})
		);

		this.stats = stats;
	}

	render(ctx: CanvasRenderingContext2D) {
		const pos = this.body.position;
		const { tank, barrel } = this.stats;

		ctx.save();
		ctx.translate(pos.x, pos.y);

		// Draw tank body
		{
			ctx.save();
			ctx.rotate(this.body.angle);
			// Draw main body
			ctx.fillStyle = '#090';
			ctx.fillRect(-tank.length / 2, -tank.width / 2, tank.length, tank.width);
			// Draw back decoration
			ctx.lineWidth = 8;
			ctx.strokeStyle = '#150';
			ctx.beginPath();
			ctx.moveTo(-14, -tank.width / 2 + 4);
			ctx.lineTo(-2, 0);
			ctx.lineTo(-14, tank.width / 2 - 4);
			ctx.stroke();
			// Draw front decoration
			ctx.beginPath();
			ctx.moveTo(2, -tank.width / 2 + 4);
			ctx.lineTo(14, 0);
			ctx.lineTo(2, tank.width / 2 - 4);
			ctx.stroke();
			// Draw tank wheel
			const wheelThickness = tank.width / 4;
			ctx.fillStyle = '#111';
			ctx.fillRect(-tank.length / 2 - 4, -tank.width / 2 - 1             , tank.length + 8, wheelThickness);
			ctx.fillRect(-tank.length / 2 - 4,  tank.width / 2 - wheelThickness, tank.length + 8, wheelThickness + 1);
			ctx.restore();
		}

		// Draw tank barrel
		{
			ctx.save();
			ctx.rotate(this.barrelAngle);

			ctx.strokeStyle = '#000';
			ctx.fillStyle = '#3b7a04';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.rect(0, -barrel.width / 2, barrel.length, barrel.width);
			ctx.stroke();
			ctx.fill();

			ctx.fillStyle = '#090';
			ctx.fillRect(0, -barrel.width / 3, barrel.length, barrel.width / 1.5);
			ctx.fillStyle = '#0a0';
			ctx.fillRect(0, -barrel.width / 6, barrel.length, barrel.width / 3);

			ctx.restore();
		}

		// ctx.fillStyle = '#fff';
		// ctx.fillText('HP: ' + this.health, 0, 0);

		ctx.restore();
	}

	shouldRender(rect: BoundingRect) {
		const { x, y } = this.body.position;
		return rect[0] < x && x < rect[2] && rect[1] < y && y < rect[3];
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

		const posOffset = Vector.mult(dir, this.stats.barrel.length + 10);
		const position = Vector.add(this.body.position, posOffset);
		const velocity = Vector.mult(dir, this.stats.shell.speed);

		const recoilForce = Vector.mult(velocity, this.stats.barrel.recoilMultiplier);
		Body.applyForce(
			this.body, this.body.position,
			Vector.mult(recoilForce, (Math.abs(Math.cos(this.body.angle - angle)) + 0.1)),
		);

		EntityManager.add(new TankShell(position, velocity, this.stats.shell));
	}
}
