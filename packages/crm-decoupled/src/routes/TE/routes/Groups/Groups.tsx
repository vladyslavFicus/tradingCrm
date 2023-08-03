import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GroupsList from './routes/GroupsList';
import NewGroup from './routes/NewGroup';
import EditGroup from './routes/EditGroup';

const Group = () => (
  <Routes>
    <Route path="list" element={<GroupsList />} />
    <Route path="new" element={<NewGroup />} />
    <Route path=":id" element={<EditGroup />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(Group);
