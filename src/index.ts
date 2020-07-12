import { h, render } from 'preact';
import { App } from './components/App';
import { TankType } from './game/TankFactory';
import './styles.scss';

window.selectedTankType = TankType.MOBI;
render(h(App, null), document.body);
