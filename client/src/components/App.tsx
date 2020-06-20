import { h, Fragment } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { createHashHistory } from 'history';
import { Router } from 'preact-router';

import { runGameClient } from '../game/GameClient';

export function App() {

	const cvs = useRef<HTMLCanvasElement>();
	useEffect(() => {
		runGameClient(cvs.current);
	}, []);

	return (
		<Fragment>
			<canvas ref={cvs} width={640} height={480} />
			<Router history={createHashHistory() as any}>

			</Router>
		</Fragment>
	);
}
