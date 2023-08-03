import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NotFound from 'routes/NotFound';
import Tabs from 'components/Tabs';
import HideDetails from 'components/HideDetails';
import ShortLoader from 'components/ShortLoader';
import useOperator from 'routes/Operators/routes/hooks/useOperator';
import { operatorTabs } from './utils';
import OperatorProfileTab from './routes/OperatorProfileTab';
import OperatorFeedsTab from './routes/OperatorFeedsTab';
import OperatorSalesRulesTab from './routes/OperatorSalesRulesTab';
import OperatorHeader from './components/OperatorHeader';
import OperatorAccountStatus from './components/OperatorAccountStatus';
import OperatorRegistrationInfo from './components/OperatorRegistrationInfo';
import OperatorPersonalInfo from './components/OperatorPersonalInfo';
import OperatorAdditionalInfo from './components/OperatorAdditionalInfo';
import './Operator.scss';

const Operator = () => {
  const {
    loading,
    isSalesOperator,
    operator,
    authorities,
    refetch,
  } = useOperator();

  if (loading) {
    return <ShortLoader />;
  }

  if (!operator) {
    return <NotFound />;
  }

  return (
    <div className="Operator">
      <OperatorHeader operator={operator} />

      <div className="Operator__content">
        <div className="Operator__info">
          <OperatorAccountStatus operator={operator} onRefetch={refetch} />

          <OperatorRegistrationInfo registrationDate={operator.registrationDate || ''} />
        </div>

        <HideDetails>
          <div className="Operator__details">
            <OperatorPersonalInfo operator={operator} />

            <OperatorAdditionalInfo authorities={authorities} />
          </div>
        </HideDetails>
      </div>

      <Tabs items={operatorTabs(isSalesOperator)} />

      <div className="Operator__tab-content">
        <Suspense fallback={null}>
          <Routes>
            <Route path="profile" element={<OperatorProfileTab operator={operator} onRefetch={refetch} />} />
            <Route path="feed" element={<OperatorFeedsTab />} />

            <If condition={isSalesOperator}>
              <Route path="sales-rules" element={<OperatorSalesRulesTab />} />
            </If>

            <Route path="*" element={<Navigate replace to="profile" />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(Operator);
