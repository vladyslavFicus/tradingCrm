import React from 'react';
import ReactDOM from 'react-dom';
import { getBackofficeBrand } from 'config';
import bootstrap from './bootstrap';
import App from './App';

bootstrap();

const MOUNT_NODE = document.getElementById('root');

if (!getBackofficeBrand()) {
  ReactDOM.render('Brand not found :(', MOUNT_NODE);
} else {
  ReactDOM.render(<App />, MOUNT_NODE);
}
