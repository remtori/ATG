import { h } from 'preact';
import { Formik, Form, FormikProps } from 'formik';
import { route } from 'preact-router';

import { DEFAULT_TANK_SETTING, TankFactorySetting } from '../game/TankFactory';
import { ColorPicker } from './ColorPicker';
import { RangeInput } from './RangeInput';
import { ScreenRoute } from './routes';

export function TankStatsEditor() {
	return (
		<Formik
			initialValues={DEFAULT_TANK_SETTING}
			onSubmit={(values, { setSubmitting }) => {
				alert(JSON.stringify(values, null, 2));
				setSubmitting(false);
				route(ScreenRoute.InGame);
			}}
		>
			{(form: FormikProps<TankFactorySetting>) => (
				<Form className='tank-stats-editor'>
					<RangeInput displayName='Tank Width' name='tankWidth' min={20} max={200} form={form} />
					<RangeInput displayName='Tank Length' name='tankLength' min={20} max={300} form={form} />
					<RangeInput displayName='Barrel Width' name='barrelWidth' min={5} max={100} form={form} />
					<RangeInput displayName='Barrel Length' name='barrelLength' min={5} max={200} form={form} />
					<ColorPicker displayName='Tank Color' name='tank' form={form} />
					<button type='submit' disabled={form.isSubmitting}>Play !</button>
				</Form>
			)}
		</Formik>
	)
}
