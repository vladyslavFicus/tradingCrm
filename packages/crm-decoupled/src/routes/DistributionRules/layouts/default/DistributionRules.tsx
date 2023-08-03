import React from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';
import DistributionRule from './DistributionRule';
import DistributionRulesList from './DistributionRulesList';

const DistributionRules = () => (
  <Routes>
    <Route path="list" element={<DistributionRulesList />} />
    <Route path=":id/*" element={<DistributionRule />} />
    <Route path="*" element={<Navigate replace to="list" />} />
  </Routes>
);

export default React.memo(DistributionRules);
