import React from 'react';
import Terms from '../container/Terms';

const Layout = ({ children }) => children ? children : <Terms />;

export default Layout;
