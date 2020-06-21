import { h } from 'preact';
import { Formik, Form, FormikProps } from 'formik';
import { route } from 'preact-router';
import { useSelector, useDispatch } from 'react-redux';

import { TankFactorySetting } from '../game/TankFactory';
import { ColorPicker } from './ColorPicker';
import { RangeInput } from './RangeInput';
import { ScreenRoute } from './routes';
import { RootState } from '../store';
import { updateTankStats } from '../reducers/tankStats';

export function TankStatsEditor() {

	const dispatch = useDispatch();
	const initialValue = useSelector<RootState, TankFactorySetting>(s => s.tankStats);

	return (
		<Formik<TankFactorySetting>
			initialValues={initialValue}
			onSubmit={(values, { setSubmitting }) => {
				dispatch(updateTankStats(values));
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
