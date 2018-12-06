/**
 * Redux
 */

 import { createStore, applyMiddleware } from 'redux';

/**
 * Middleware
 */

import logger from './logger';
import errorMiddleware from './middleware'
import promise from 'redux-promise-middleware'
import { createEpicMiddleware } from 'redux-observable'

/**
 * Action Receivers
 */

import rootEpic from './epics'
import rootReducer from './reducers'


const epicMiddleware = createEpicMiddleware();

function configureStore() { 
    const createdStore = createStore( 
        rootReducer,
        applyMiddleware(
            epicMiddleware,         
            errorMiddleware, 
            logger,
            promise() 
        ))
    epicMiddleware.run(rootEpic)
    return createdStore;
};

export default configureStore();