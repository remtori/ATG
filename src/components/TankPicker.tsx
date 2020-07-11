import { h, Fragment } from 'preact';
import { useCallback } from 'preact/hooks';
import { route } from 'preact-router';
import { Scene } from './routes';


const StatBar = ({ percentage }: { percentage: number }) => (
	<div class='stat-bar'>
		<div style={{ width: percentage }} />
	</div>
);

const StatTab = ({ mobi, dmg, health }: { mobi: number, dmg: number, health: number }) => (
	<Fragment>
		<div>
			<span>Mobility</span>
			<StatBar percentage={mobi} />
		</div>
		<div>
			<span>Damage</span>
			<StatBar percentage={dmg} />
		</div>
		<div>
			<span>Health</span>
			<StatBar percentage={health} />
		</div>
	</Fragment>
);

export function TankPicker() {

	const onClick = useCallback((e: Event) => {
		(window as any).selectedTankType = (e.srcElement as any).dataset.tankType;
		route(Scene.InGame);
	}, []);

	return (
		<div class='tank-picker'>
			<div>
				<span>MOBI</span>
				<div>
					<div class='preview-tank-mobi' />
					<StatTab mobi={100} dmg={50} health={50} />
					<button data-tank-type='M' onClick={onClick} >PICK!</button>
				</div>
			</div>
			<div>
				<span>AVG</span>
				<div>
					<div class='preview-tank-avg' />
					<StatTab mobi={75} dmg={75} health={75} />
					<button data-tank-type='A' onClick={onClick}>PICK!</button>
				</div>
			</div>
			<div>
				<span>ADC</span>
				<div>
					<div class='preview-tank-adc' />
					<StatTab mobi={50} dmg={100} health={100} />
					<button data-tank-type='D' onClick={onClick}>PICK!</button>
				</div>
			</div>
		</div>
	);
}
