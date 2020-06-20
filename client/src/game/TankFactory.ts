import { Tank } from './Tank';

export interface TankFactorySetting {
	tankWidth: number;
	tankLength: number;
	barrelWidth: number;
	barrelLength: number;
	color: {
		tank: string;
		barrel: string;
		shell: string;
	}
};

export const DEFAULT_TANK_SETTING: TankFactorySetting = {
	tankWidth: 30,
	tankLength: 50,
	barrelWidth: 20,
	barrelLength: 40,
	color: {
		tank: '#e00',
		barrel: '#0e0',
		shell: '#00f',
	}
};

export function createTank(
	{ tankWidth, tankLength, barrelLength, barrelWidth, color }: TankFactorySetting = DEFAULT_TANK_SETTING
): Tank {
	const maxMovementSpeed = 3;
	const maxRotateSpeed = 0.1;
	const maxBulletSpeed = 10;
	const maxBarrelRotateSpeed = 0.25;
	const minBulletSize = 5;
	const minBulletAge = 50;
	const minHealth = 50;
	const minRecoilMultiplier = -0.01;
	const minCooldownTime = 2;
	const minCooldownSpeed = 1;
	const minAccuracy = Math.PI / 12;

	return new Tank({ x: 200, y: 200 }, {
		shell: {
			age: minBulletAge,
			speed: maxBulletSpeed,
			radius: minBulletSize,
			health: 1,
			damage: 1,
			color: color.shell,
		},
		tank: {
			width: tankWidth,
			length: tankLength,
			health: minHealth + (tankWidth * tankLength) * 0.2,
			rotationSpeed: maxRotateSpeed - (tankWidth * tankLength) * 0.00005 - (barrelWidth * barrelLength) * 0.00001,
			movementSpeed: maxMovementSpeed - (tankWidth * tankLength) * 0.0005 - (barrelWidth * barrelLength) * 0.0001,
			color: color.tank,
		},
		barrel: {
			width: barrelWidth,
			length: barrelLength,
			accuracy: minAccuracy + tankLength * 0.0005 + barrelLength * 0.005,
			recoilMultiplier: minRecoilMultiplier,
			cdTime: minCooldownTime,
			cdSpeed: minCooldownSpeed,
			rotationSpeed: maxBarrelRotateSpeed - (barrelWidth * barrelLength) * 0.00005,
			color: color.barrel,
		},
	});
}
