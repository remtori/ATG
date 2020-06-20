import { h } from 'preact';
import { useRef } from 'preact/hooks';
import { FormikProps, Field } from 'formik';
import { TankFactorySetting } from '../game/TankFactory';

// TODO: Generalize these
export interface RangeInputProps {
	min: number;
	max: number;
	name: keyof Omit<TankFactorySetting, 'color'>;
	displayName: string;
	form: FormikProps<TankFactorySetting>;
}

export function RangeInput({ max, min, form, name, displayName }: RangeInputProps) {
	const inp = useRef<HTMLInputElement>();
	return (
		<div class='range-input'>
			<label>{displayName}</label>
			<div>
				<input
					ref={inp}
					type='range'
					min={min}
					max={max}
					onInput={() => { form.setFieldValue(name, inp.current.value) }}
					value={form.values[name]}
				/>
				<Field type='number' min={min} max={max} name={name} />
			</div>
		</div>
	);
}