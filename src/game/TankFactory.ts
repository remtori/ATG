import { Tank, TankStats } from './entities/Tank';

const tankCreator = (stats: TankStats) => (x: number, y: number) => new Tank(x, y, stats);

export enum TankType {
	MOBI = 'M',
	AVG  = 'A',
	ADC  = 'D',
};

const tankFromType = {
	[TankType.MOBI]: tankCreator({
		shell: {
			hasImpact: false,
			age: 50,
			speed: 10,
			radius: 2,
			health: 1,
			damage: 10,
		},
		tank: {
			width: 30,
			length: 38,
			health: 100,
			rotationSpeed: 0.075,
			movementSpeed: 2,
		},
		barrel: {
			width: 6,
			length: 25,
			accuracy: 0.8,
			recoilMultiplier: -0.01,
			cdTime: 5,
			cdSpeed: 1,
			rotationSpeed: 0.075,
		},
	}),
	[TankType.AVG]: tankCreator({
		shell: {
			hasImpact: true,
			age: 100,
			speed: 7,
			radius: 5,
			health: 30,
			damage: 60,
		},
		tank: {
			width: 45,
			length: 55,
			health: 200,
			rotationSpeed: 0.05,
			movementSpeed: 1.5,
		},
		barrel: {
			width: 12,
			length: 40,
			accuracy: 0.9,
			recoilMultiplier: -0.5,
			cdTime: 25,
			cdSpeed: 1,
			rotationSpeed: 0.05,
		},
	}),
	[TankType.ADC]: tankCreator({
		shell: {
			hasImpact: true,
			age: 300,
			speed: 15,
			radius: 9,
			health: 50,
			damage: 175,
		},
		tank: {
			width: 55,
			length: 70,
			health: 300,
			rotationSpeed: 0.02,
			movementSpeed: 1,
		},
		barrel: {
			width: 16,
			length: 60,
			accuracy: 0.95,
			recoilMultiplier: -2,
			cdTime: 75,
			cdSpeed: 1,
			rotationSpeed: 0.02,
		},
	}),
};

export const createTankFromType = (x: number, y: number, type: TankType) => tankFromType[type](x, y);
