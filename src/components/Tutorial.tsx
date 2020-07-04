import { h } from 'preact';
import { useTutorial } from '../hooks/useTutorial';


export function Tutorial() {

	const { text, skip } = useTutorial();

	return (
		<div class='tutorial-textbox'>
			<div>{text}</div>
			<div class='skip-btn'><a onClick={skip}>{`>> Skip`}</a></div>
		</div>
	);
}
