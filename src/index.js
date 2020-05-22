// # remove - Redux part that must be removed after reduxForm will be removed
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux'; // # remove
import { reducer as formReducer } from 'redux-form'; // # remove
import { getBackofficeBrand } from 'config';
import bootstrap from './bootstrap';
import App from './App';

bootstrap();

const store = createStore(combineReducers({ form: formReducer })); // #remove

const MOUNT_NODE = document.getElementById('root');

if (!getBackofficeBrand()) {
  ReactDOM.render(
    'Brand not found in cookie: brand=BRAND_NAME or in process.env.NAS_BRAND or in local brand configuration',
    MOUNT_NODE,
  );
} else {
  ReactDOM.render(<App store={store} />, MOUNT_NODE); // # remove -> store
}
