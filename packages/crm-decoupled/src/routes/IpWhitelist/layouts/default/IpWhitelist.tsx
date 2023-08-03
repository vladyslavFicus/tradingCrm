import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Tabs from 'components/Tabs';
import { ipWhitelistTabs } from '../../constants/ipWhitelist';
import IpWhitelistFeed from './routes/IpWhitelistFeed';
import IpWhitelistList from './routes/IpWhitelistList';
import './IpWhitelist.scss';

const IpWhitelist = () => (
  <div className="IpWhitelist">
    <Tabs items={ipWhitelistTabs} className="IpWhitelist__tabs" />

    <Routes>
      <Route path="list" element={<IpWhitelistList />} />
      <Route path="feed" element={<IpWhitelistFeed />} />
      <Route path="*" element={<Navigate replace to="list" />} />
    </Routes>
  </div>
);

export default React.memo(IpWhitelist);
