import { h } from 'preact';
import { useRef, useCallback } from 'preact/hooks';
import { Formik, Form, Field, ErrorMessage, FormikState, FormikProps } from 'formik';
import { DEFAULT_TANK_SETTING, TankFactorySetting } from '../game/TankFactory';

export function TankStatsEditor() {
	return (
		<Formik
			initialValues={DEFAULT_TANK_SETTING}
			onSubmit={(values, { setSubmitting }) => {
				alert(JSON.stringify(values, null, 2));
				setSubmitting(false);
			}}
		>
			{({ isSubmitting, ...form }: FormikProps<TankFactorySetting>) => (
				<Form class='tank-stats-editor'>
					<RangeInput displayName='Tank Width' name='tankWidth' min={20} max={200} form={form} />
					<RangeInput displayName='Tank Length' name='tankLength' min={20} max={300} form={form} />
					<RangeInput displayName='Barrel Width' name='barrelWidth' min={5} max={100} form={form} />
					<RangeInput displayName='Barrel Length' name='barrelLength' min={5} max={200} form={form} />
					<button type='submit' disabled={isSubmitting}>Submit</button>
				</Form>
			)}
		</Formik>
	)
}

function RangeInput({ max, min, form, name, displayName }: any) {
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
