import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Files from './routes/Files';
import Client from './routes/Client';
import ClientsList from './routes/ClientsList';
import ClientCallbacks from './routes/Callbacks';

const Clients = () => (
  <Routes>
    <Route path="list" element={<ClientsList />} />
    <Route path="callbacks/*" element={<ClientCallbacks />} />
    <Route path="kyc-documents" element={<Files />} />
    <Route path=":id/*" element={<Client />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(Clients);
