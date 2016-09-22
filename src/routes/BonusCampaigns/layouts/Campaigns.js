import React from 'react';
import Campaigns from '../container/Campaigns';

const Layout = ({ children }) => children ? children : <Campaigns />;

export default Layout;
