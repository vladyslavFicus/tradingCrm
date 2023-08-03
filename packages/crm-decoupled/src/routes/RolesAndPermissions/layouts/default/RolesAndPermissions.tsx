import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Tabs from 'components/Tabs';
import RbacFeed from './routes/RbacFeed';
import RbacGrid from './routes/RbacGrid';
import { rbacTabs } from './constants';
import './RolesAndPermissions.scss';

const RolesAndPermissions = () => (
  <div className="RolesAndPermissions">
    <Tabs items={rbacTabs} className="RolesAndPermissions__tabs" />

    <Routes>
      <Route path="permissions" element={<RbacGrid />} />
      <Route path="feed" element={<RbacFeed />} />
      <Route path="*" element={<Navigate replace to="permissions" />} />
    </Routes>
  </div>
);

export default React.memo(RolesAndPermissions);
