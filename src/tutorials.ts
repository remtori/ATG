import { Tank } from './game/Tank';

const epsilon = 5;
const isAround = (a: number, b: number) => Math.abs(a - b) < epsilon;

export const tutorials = [
	// 0
	{
		text: `Try using W, A, S, D to move around`,
		isComplete: (tank: Tank) => {
			return isAround(tank.body.position.x, 200) &&  isAround(tank.body.position.y, 200);
		}
	},
];
