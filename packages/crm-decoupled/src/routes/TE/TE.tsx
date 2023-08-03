import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Quotes from './routes/Quotes';
import Symbols from './routes/Symbols';
import Orders from './routes/Orders';
import Securities from './routes/Securities';
import Groups from './routes/Groups';
import Accounts from './routes/Accounts';
import MarginCalls from './routes/MarginCalls';
import Holidays from './routes/Holidays';
import Operators from './routes/Operators';
import OperatorProfile from './routes/DealingOperator';
import AccountProfile from './routes/AccountProfile';
import './TE.scss';

const TE = () => (
  <div className="TradingEngine">
    <Suspense fallback={null}>
      <Routes>
        <Route path="orders" element={<Orders />} />
        <Route path="quotes" element={<Quotes />} />
        <Route path="symbols/*" element={<Symbols />} />
        <Route path="securities" element={<Securities />} />
        <Route path="accounts/:id/*" element={<AccountProfile />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="margin-calls" element={<MarginCalls />} />
        <Route path="groups/*" element={<Groups />} />
        <Route path="holidays/*" element={<Holidays />} />
        <Route path="operators/:id/*" element={<OperatorProfile />} />
        <Route path="operators" element={<Operators />} />
        <Route path="*" element={<Navigate replace to="orders" />} />
      </Routes>
    </Suspense>
  </div>
);

export default React.memo(TE);
