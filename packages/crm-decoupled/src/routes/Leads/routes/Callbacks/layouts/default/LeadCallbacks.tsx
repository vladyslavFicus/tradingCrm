import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LeadCallbacksList from './routes/LeadCallbacksList';
import LeadCallbacksCalendar from './routes/LeadCallbacksCalendar';

const LeadCallbacks = () => (
  <Routes>
    <Route path="list" element={<LeadCallbacksList />} />
    <Route path="calendar" element={<LeadCallbacksCalendar />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(LeadCallbacks);
