import { h, Fragment } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { createHashHistory, createMemoryHistory, History } from 'history';
import { Router, Route } from 'preact-router';

import { runGameClient } from '../game/GameClient';
import { Scene } from './routes';
import { Tutorial } from './Tutorial';
import { TankPicker } from './TankPicker';

const history = createMemoryHistory();

export function App() {
	const cvs = useRef<HTMLCanvasElement>();
	const cvsOverlay = useRef<HTMLDivElement>();

	useEffect(() => {
		(window as any).globalCanvasRect = cvs.current.getBoundingClientRect();
		runGameClient(cvs.current);

		function onResize() {
			(window as any).globalCanvasRect = cvs.current.getBoundingClientRect();
			cvsOverlay.current.style.top = globalCanvasRect.top + 'px';
			cvsOverlay.current.style.left = globalCanvasRect.left + 'px';
			cvsOverlay.current.style.width = globalCanvasRect.width + 'px';
			cvsOverlay.current.style.height = globalCanvasRect.height + 'px';
		}

		onResize();
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		}
	}, []);

	return (
		<Fragment>
			<canvas class='game-canvas' ref={cvs} width={960} height={640} />
			<div class='canvas-overlay' ref={cvsOverlay}>
				<div class='ui-wrapper'>
					<Router history={history as any} url={Scene.TankPicker} >
						<Route path={Scene.Tutorial} component={Tutorial} />
						<Route path={Scene.TankPicker} component={TankPicker} />
					</Router>
				</div>
			</div>
		</Fragment>
	);
}
