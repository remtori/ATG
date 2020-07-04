import { h } from 'preact';
import { useTutorial } from '../hooks/useTutorial';
import { Scene } from './routes';
import { route } from 'preact-router';

const skipTutorial = () => route(Scene.InGame);

export function Tutorial() {

	const { text } = useTutorial();

	return (
		<div class='tutorial-textbox'>
			<div>{text}</div>
			<div class='skip-btn'><span onClick={skipTutorial}>{`>> Skip`}</span></div>
		</div>
	);
}
