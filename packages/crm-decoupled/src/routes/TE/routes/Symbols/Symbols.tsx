import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SymbolsList from './routes/SymbolsList';
import SymbolNew from './routes/SymbolNew';
import SymbolEdit from './routes/SymbolEdit';

const Symbols = () => (
  <Routes>
    <Route path="list" element={<SymbolsList />} />
    <Route path="new" element={<SymbolNew />} />
    <Route path=":id" element={<SymbolEdit />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(Symbols);
