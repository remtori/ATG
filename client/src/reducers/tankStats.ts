import { DEFAULT_TANK_SETTING, TankFactorySetting } from '../game/TankFactory';

export const UPDATE_TANK_STATS = 'UPDATE_TANK_STATS';

export function updateTankStats(stats: TankFactorySetting) {
	return {
		type: UPDATE_TANK_STATS,
		payload: stats
	};
}

export type TankStatsAction = ReturnType<typeof updateTankStats>;

export function tankStats(state: TankFactorySetting = DEFAULT_TANK_SETTING, action: TankStatsAction) {
	switch (action.type) {
		case UPDATE_TANK_STATS:
			return action.payload;
		default:
			return state;
	}
}
