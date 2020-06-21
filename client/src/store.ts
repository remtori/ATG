import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { tankStats } from './reducers/tankStats';

const rootReducer = {
	tankStats,
};

type RRO = typeof rootReducer;
export type RootState = { [P in keyof RRO]: ReturnType<RRO[P]> };

export const store = createStore(
	combineReducers(rootReducer),
	compose(applyMiddleware(thunkMiddleware))
);
