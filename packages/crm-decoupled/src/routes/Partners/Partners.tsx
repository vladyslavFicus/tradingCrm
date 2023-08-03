import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Partner, PartnersList } from './routes';

const Partners = () => (
  <Routes>
    <Route path="list" element={<PartnersList />} />
    <Route path=":id/*" element={<Partner />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(Partners);
