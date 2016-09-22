import React from 'react';
import Bonuses from '../container/Bonuses';

const Layout = ({ children }) => children ? children : <Bonuses />;

export default Layout;
