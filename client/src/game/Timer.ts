export class Timer {

	private handler: number;
	private deltaTime: number;
	private lastTime: number = 0;
	private accumulatedTime: number = 0;
	private loop: (time: number) => void;

	render = () => {};
	update = (deltaTime: number) => {};
	onStart = () => {};
	onStop = () => {};

	constructor(deltaTime = 1000 / 60) {
		this.deltaTime = deltaTime;
		this.loop = (newTime: number) => {
			this.accumulatedTime += newTime - this.lastTime;
			if (this.accumulatedTime > 1000) {
				console.warn(
					`Can keep up! Browser may just out of focus or the machine is just not fast enough, skipping ${Math.floor(this.accumulatedTime / this.deltaTime)} tick (${this.accumulatedTime}ms)`
				);
				this.accumulatedTime = this.deltaTime;
			}

			while (this.accumulatedTime >= this.deltaTime) {
				this.accumulatedTime -= this.deltaTime;
				this.update(this.deltaTime);
			}
			this.render();

			this.lastTime = newTime;
			this.handler = requestAnimationFrame(this.loop);
		}
	}

	start() {
		this.onStart();
		this.handler = requestAnimationFrame(this.loop);
	}

	stop() {
		cancelAnimationFrame(this.handler);
		this.onStop();
	}
}
