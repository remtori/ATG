import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { ChromePicker } from 'react-color';
import { FormikProps, Field, ErrorMessage } from 'formik';
import { TankFactorySetting } from '../game/TankFactory';

// TODO: Generalize these
export interface ColorPickerProps {
	displayName: string;
	name: keyof TankFactorySetting['color'];
	form: FormikProps<TankFactorySetting>;
}

export function ColorPicker({ displayName, name, form }: ColorPickerProps) {

	const [ isOpen, setIsOpen ] = useState(false);
	const formikName = 'color.' + name;
	const btn = useRef<HTMLSpanElement>();

	useEffect(() => {
		function onBtnClick(e: Event) {
			e.stopPropagation();
			setIsOpen(true);
		}

		function onClick() {
			setIsOpen(false);
		}

		function onKeydown(e: KeyboardEvent) {
			if (e.key == 'esc')
				setIsOpen(false);
		}

		btn.current.addEventListener('click', onBtnClick, false);
		window.addEventListener('click', onClick);
		window.addEventListener('keydown', onKeydown);

		return () => {
			btn.current.removeEventListener('click', onBtnClick);
			window.removeEventListener('click', onClick);
			window.removeEventListener('keydown', onKeydown);
		}
	}, []);

	return (
		<div>
			<label>{ displayName }</label>
			<div>
				<Field type='text' name={formikName} validate={hexColorValidator} maxlength={7} />
				<span ref={btn} class='square-color' style={{ backgroundColor: form.values.color[name] }}>
					<div style={{ display: isOpen ? 'block' : 'none' }} class='color-picker-wrapper'>
						<ChromePicker
							color={form.values.color[name]}
							onChange={color => form.setFieldValue(formikName, color.hex)}
							disableAlpha={true}
						/>
					</div>
				</span>
				<ErrorMessage component="div" className='field-error' name={formikName} />
			</div>
		</div>
	);
}

function hexColorValidator(color: string) {
	if (!/^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(color))
		return 'Invalid hex color';
}
