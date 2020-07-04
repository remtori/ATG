import { Tank, TankStats } from './Tank';

const tankCreator = (stats: TankStats) => (pos: [ number, number ]) => new Tank(pos, stats);

export enum TankType {
	MOBI = 1,
	AVG  = 2,
	ADC  = 3,
};

const tankFromType = {
	[TankType.MOBI]: tankCreator({
		shell: {
			age: 50,
			speed: 10,
			radius: 2,
			health: 1,
			damage: 5,
			color: '#00f',
		},
		tank: {
			width: 30,
			length: 40,
			health: 100,
			rotationSpeed: 0.075,
			movementSpeed: 2,
			color: '#0f0',
		},
		barrel: {
			width: 8,
			length: 30,
			accuracy: 1,
			recoilMultiplier: -0.01,
			cdTime: 5,
			cdSpeed: 1,
			rotationSpeed: 0.075,
			color: '#f00',
		},
	}),
	[TankType.AVG]: tankCreator({
		shell: {
			age: 100,
			speed: 7,
			radius: 5,
			health: 10,
			damage: 55,
			color: '#00f',
		},
		tank: {
			width: 40,
			length: 50,
			health: 200,
			rotationSpeed: 0.05,
			movementSpeed: 1.5,
			color: '#0f0',
		},
		barrel: {
			width: 16,
			length: 40,
			accuracy: 1,
			recoilMultiplier: -0.01,
			cdTime: 25,
			cdSpeed: 1,
			rotationSpeed: 0.05,
			color: '#f00',
		},
	}),
	[TankType.ADC]: tankCreator({
		shell: {
			age: 300,
			speed: 15,
			radius: 9,
			health: 15,
			damage: 175,
			color: '#00f',
		},
		tank: {
			width: 60,
			length: 80,
			health: 300,
			rotationSpeed: 0.02,
			movementSpeed: 0.75,
			color: '#0f0',
		},
		barrel: {
			width: 20,
			length: 60,
			accuracy: 1,
			recoilMultiplier: -0.01,
			cdTime: 75,
			cdSpeed: 1,
			rotationSpeed: 0.02,
			color: '#f00',
		},
	}),
};

export const createTankFromType = (pos: [ number, number ], type: TankType) => tankFromType[type](pos);