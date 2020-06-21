import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { createHashHistory, createMemoryHistory } from 'history';
import { Router, Route } from 'preact-router';
import { Provider } from 'react-redux';

import { runGameClient } from '../game/GameClient';
import { ScreenRoute } from './routes';
import { GameUI } from './GameUI';
import { setupOverlay } from '../utils';
import { MainMenu } from './MainMenu';
import { store } from '../store';

const history: any = process.env.NODE_ENV === 'production' ? createMemoryHistory() : createHashHistory();

export function App() {
	const cvs = useRef<HTMLCanvasElement>();
	const cvsOverlay = useRef<HTMLDivElement>();

	useEffect(() => {
		runGameClient(cvs.current);
		setupOverlay(cvs.current, cvsOverlay.current);

		function onResize() {
			const rect = cvs.current.getBoundingClientRect();
			cvsOverlay.current.style.top = rect.top + 'px';
			cvsOverlay.current.style.left = rect.left + 'px';
			cvsOverlay.current.style.width = rect.width + 'px';
			cvsOverlay.current.style.height = rect.height + 'px';
		}

		onResize();
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		}
	}, []);

	return (
		<Provider store={store}>
			<canvas class='game-canvas' ref={cvs} width={640} height={480} />
			<div class='canvas-overlay' ref={cvsOverlay}>
				<div class='ui-wrapper'>
					<Router history={history} path={ScreenRoute.MainMenu} >
						<Route path={ScreenRoute.MainMenu} component={MainMenu} />
						<Route path={ScreenRoute.InGame} overlay={cvsOverlay} component={GameUI} />
					</Router>
				</div>
			</div>
		</Provider>
	);
}
