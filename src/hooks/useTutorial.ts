import { useEffect, useReducer, useCallback } from 'preact/hooks';
import { Events } from 'matter-js';
import { route } from 'preact-router';

import { engine }  from '../game/PhysicEngine';
import { getControlledTank } from '../game/TankController';
import { Scene } from '../components/routes';
import { tutorials } from '../tutorials';

export function useTutorial() {

	const [ tutorialState, nextTutorialState ] = useReducer(s => s + 1, 0);

	useEffect(() => {
		function onUpdate() {
			const tank = getControlledTank();
			if (!tank) return;

			if (tutorials[tutorialState].isComplete(tank)) {
				if (tutorialState + 1 == tutorials.length)
					route(Scene.InGame);

				nextTutorialState(null);
			}
		}

		Events.on(engine, 'afterUpdate', onUpdate);

		return () => Events.off(engine, 'afterUpdate', onUpdate);
	}, [ tutorialState ]);

	return {
		text: tutorials[tutorialState].text,
	}
}