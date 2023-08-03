import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientCallbacksList from './ClientCallbacksList';
import ClientCallbacksCalendar from './ClientCallbacksCalendar';

const ClientCallbacks = () => (
  <Routes>
    <Route path="list" element={<ClientCallbacksList />} />
    <Route path="calendar" element={<ClientCallbacksCalendar />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(ClientCallbacks);
