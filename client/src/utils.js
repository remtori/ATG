
let alreadySetup = false;
export function setupOverlay(canvas, overlay) {
	if (alreadySetup) return;
	alreadySetup = true;

	function forward(e) {
		const newEvent = new Event(e.type);
		(['x', 'y', 'offsetX', 'offsetY', 'button']).forEach((key) => {
			newEvent[key] = e[key];
		})
		// if (overlay.style.display === 'none')
			canvas.dispatchEvent(newEvent);
	}

	overlay.addEventListener('mousedown', forward);
	overlay.addEventListener('mousemove', forward);
}