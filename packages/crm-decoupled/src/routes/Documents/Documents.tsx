import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Tabs from 'components/Tabs';
import { DocumentsFeed, DocumentsList } from './routes';
import { documentsTabs } from './constants';
import './Documents.scss';

const Documents = () => (
  <div className="Documents">
    <Tabs items={documentsTabs} className="Documents__tabs" />

    <Routes>
      <Route path="list" element={<DocumentsList />} />
      <Route path="feed" element={<DocumentsFeed />} />
      <Route path="*" element={<Navigate replace to="list" />} />
    </Routes>
  </div>
);

export default Documents;
