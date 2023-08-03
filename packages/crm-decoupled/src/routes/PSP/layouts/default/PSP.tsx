import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Tabs from 'components/Tabs';
import { pspTabs } from '../../constants/PSP';
import PSPList from './routes/PSPList';
import PSPFeed from './routes/PSPFeed';
import './PSP.scss';

const PSP = () => (
  <div className="PSP">
    <Tabs items={pspTabs} className="PSP__tabs" />

    <Routes>
      <Route path="list" element={<PSPList />} />
      <Route path="feed" element={<PSPFeed />} />
      <Route path="*" element={<Navigate replace to="list" />} />
    </Routes>
  </div>
);

export default React.memo(PSP);
