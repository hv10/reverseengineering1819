import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { batchDispatchMiddleware } from 'redux-batched-actions';

import datastore from './store';
import wardata from './wardata';
import prediction from './prediction';
import dialog from './dialog';

const reducer = combineReducers({
    dialog,
    wardata,
    prediction,
    datastore
});

const composeEnhancers = compose; //window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    {},
    composeEnhancers(applyMiddleware(batchDispatchMiddleware))
);

export default store;
