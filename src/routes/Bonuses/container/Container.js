import React from 'react';
import List from '../components/List';

const Container = ({ children }) => children ? children : <List />;

export default Container;
