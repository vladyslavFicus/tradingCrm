import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TeamsList from './routes/TeamsList';
import TeamProfile from './routes/TeamProfile';

const Teams = () => (
  <Routes>
    <Route path="list" element={<TeamsList />} />
    <Route path=":id" element={<TeamProfile />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(Teams);
