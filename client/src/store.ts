import { Engine } from 'matter-js';

export const cvs = document.getElementById('cvs') as HTMLCanvasElement;
export const ctx = cvs.getContext('2d');
export const { width, height } = cvs;

function getScale() {
	return cvs.getBoundingClientRect().height / height;
}

export let scale = getScale();
window.addEventListener('resize', e => {
	scale = getScale();
});

export const engine = Engine.create();
engine.world.gravity.y = 0;
