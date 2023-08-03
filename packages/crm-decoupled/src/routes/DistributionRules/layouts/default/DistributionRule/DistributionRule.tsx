import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ShortLoader from 'components/ShortLoader';
import Tabs from 'components/Tabs';
import NotFound from 'routes/NotFound';
import UseDistributionRule from 'routes/DistributionRules/hooks/useDistributionRule';
import { distributionRuleTabs } from './utils';
import DistributionRuleHeader from './components/DistributionRuleHeader';
import DistributionRuleInfo from './components/DistributionRuleInfo';
import DistributionRuleGeneral from './routes/DistributionRuleGeneral';
import DistributionRuleFeeds from './routes/DistributionRuleFeeds';
import DistributionRuleSchedule from './routes/DistributionRuleSchedule';
import './DistributionRule.scss';

const DistributionRule = () => {
  const {
    loading,
    distributionRule,
    distributionRuleError,
    showScheduleSettingsTab,
  } = UseDistributionRule();

  return (
    <Choose>
      <When condition={loading}>
        <ShortLoader />
      </When>

      <When condition={distributionRuleError}>
        <NotFound />
      </When>

      <Otherwise>
        <div className="DistributionRule">
          <DistributionRuleHeader distributionRule={distributionRule} />
          <DistributionRuleInfo distributionRule={distributionRule} />

          <Tabs
            className="DistributionRule__tabs"
            items={distributionRuleTabs(showScheduleSettingsTab)}
          />

          <Suspense fallback={null}>
            <Routes>
              <Route path="general" element={<DistributionRuleGeneral />} />
              <Route path="feed" element={<DistributionRuleFeeds />} />

              <If condition={showScheduleSettingsTab}>
                <Route path="schedule" element={<DistributionRuleSchedule />} />
              </If>

              <Route path="*" element={<Navigate replace to="general" />} />
            </Routes>
          </Suspense>
        </div>
      </Otherwise>
    </Choose>
  );
};

export default React.memo(DistributionRule);
