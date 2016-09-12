import React from 'react';
import List from '../components/List';

const Container = ({ children, content }) => content ? content : <List />;

export default Container;
