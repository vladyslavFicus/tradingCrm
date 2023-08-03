import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Operator, OperatorsList } from './routes';

const Operators = () => (
  <Routes>
    <Route path="list" element={<OperatorsList />} />
    <Route path=":id/*" element={<Operator />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(Operators);
