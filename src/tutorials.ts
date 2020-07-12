import { Tank } from './game/entities/Tank';
import { EntityManager } from './game/entities/EntityManager';

const epsilon = 30;
const isAround = (a: number, b: number) => Math.abs(a - b) < epsilon;

export const tutorials = [
	{
		text: `Try using W, A, S, D to move to the X mark`,
		isComplete: (tank: Tank) => {
			return isAround(tank.body.position.x, 450) &&  isAround(tank.body.position.y, 100);
		}
	},
	{
		text: `Try to Mouse over the other tank and LEFT-CLICK to destroy it`,
		isComplete: (tank: Tank) => {
			let isTargetDead = true;
			EntityManager.forEach(entity => {
				if (entity.body.label === 'TARGET_DUMMY')
					isTargetDead = false;
			});
			return isTargetDead;
		}
	},
	{
		text: `You can switch tank by standing on the S symbol and press SPACE`,
		isComplete: (tank: Tank) => {
			return false;
		}
	}
];
