import { h } from 'preact';
import { Link } from 'preact-router';
import { useTutorial } from '../hooks/useTutorial';
import { Scene } from './routes';


export function Tutorial() {

	const { text } = useTutorial();

	return (
		<div class='tutorial-textbox'>
			<div>{text}</div>
			<div class='skip-btn'><Link href={Scene.InGame}>{`>> Skip`}</Link></div>
		</div>
	);
}
