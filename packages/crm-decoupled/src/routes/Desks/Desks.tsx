import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DeskProfile, DesksList } from './routes/layouts';

const Desks = () => (
  <Routes>
    <Route path="list" element={<DesksList />} />
    <Route path=":id" element={<DeskProfile />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(Desks);
