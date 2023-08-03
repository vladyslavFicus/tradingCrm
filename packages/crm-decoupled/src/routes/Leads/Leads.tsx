import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LeadsList from './routes/LeadsList';
import LeadCallbacks from './routes/Callbacks';
import Lead from './routes/Lead';

const Leads = () => (
  <Routes>
    <Route path="list" element={<LeadsList />} />
    <Route path="callbacks/*" element={<LeadCallbacks />} />
    <Route path=":id/*" element={<Lead />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(Leads);
