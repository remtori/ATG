import { Tank } from './game/Tank';

const epsilon = 25;
const isAround = (a: number, b: number) => Math.abs(a - b) < epsilon;

export const tutorials = [
	{
		text: `Try using W, A, S, D to move to the X mark`,
		isComplete: (tank: Tank) => {
			return isAround(tank.body.position.x, 200) &&  isAround(tank.body.position.y, 100);
		}
	},
	{
		text: `Try to Mouse Over the other tank and Left-Click to destroy it`,
		isComplete: (tank: Tank) => {
			return false;
		}
	}
];
