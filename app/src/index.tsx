import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import UserGrid from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
        <UserGrid />
    </Provider>, document.getElementById('root')
);

serviceWorker.unregister();


