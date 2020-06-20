import { Engine } from 'matter-js';

export const engine = Engine.create();
engine.world.gravity.y = 0;
