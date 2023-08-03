import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OfficesList from './routes/OfficesList';
import OfficeProfile from './routes/OfficeProfile';

const Offices = () => (
  <Routes>
    <Route path="list" element={<OfficesList />} />
    <Route path=":id" element={<OfficeProfile />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(Offices);
