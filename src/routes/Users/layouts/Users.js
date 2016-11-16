import React from 'react';
import Users from '../container/Users';

export default ({ children, content }) => (content ? content : <Users />);
