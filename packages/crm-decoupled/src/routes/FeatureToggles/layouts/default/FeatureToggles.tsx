import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Tabs from 'components/Tabs';
import { featureTabs } from '../../constants/featureToggles';
import FeatureForm from './routes/FeatureForm';
import FeatureFeed from './routes/FeatureFeed';
import './FeatureToggles.scss';

const FeatureToggles = () => (
  <div className="FeatureToggles">
    <Tabs items={featureTabs} className="FeatureToggles__tabs" />

    <Routes>
      <Route path="features" element={<FeatureForm />} />
      <Route path="feed" element={<FeatureFeed />} />
      <Route path="*" element={<Navigate replace to="features" />} />
    </Routes>
  </div>
);

export default React.memo(FeatureToggles);
