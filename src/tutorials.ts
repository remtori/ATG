import { Tank } from './game/Tank';

export const tutorials = [
	// 0
	{
		text: `Try using W, A, S, D to move around`,
		isComplete: (tank: Tank) => {
			return (tank.body.position.x < tank.body.position.y);
		}
	},
];
