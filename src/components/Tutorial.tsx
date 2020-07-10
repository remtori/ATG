import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Events } from 'matter-js';

import { engine }  from '../game/PhysicEngine';
import { getControlledTank } from '../game/TankController';
import { Scene } from './routes';
import { tutorials } from '../tutorials';

const skipTutorial = () => route(Scene.InGame);

function useTutorial() {

	const [ tutorialState, nextTutorialState ] = useState(0);

	useEffect(() => {
		function onUpdate() {
			const tank = getControlledTank();
			if (!tank) return;

			if (tutorials[tutorialState].isComplete(tank)) {

				if (tutorialState + 1 == tutorials.length)
					skipTutorial();

				nextTutorialState(tutorialState + 1);
			}
		}

		Events.on(engine, 'afterUpdate', onUpdate);

		return () => Events.off(engine, 'afterUpdate', onUpdate);
	}, [ tutorialState ]);

	return {
		text: tutorials[tutorialState].text,
	}
}

export function Tutorial() {

	const { text } = useTutorial();

	return (
		<div class='tutorial-textbox'>
			<div>{text}</div>
			<div class='skip-btn'><span onClick={skipTutorial}>{`>> Skip`}</span></div>
		</div>
	);
}
