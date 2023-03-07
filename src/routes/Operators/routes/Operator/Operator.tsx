import React, { useEffect, Suspense } from 'react';
import { Switch, Redirect, useParams, RouteComponentProps } from 'react-router-dom';
import { operatorTabs } from 'config/menu';
import { isSales, userTypes } from 'constants/hierarchyTypes';
import NotFound from 'routes/NotFound';
import EventEmitter, { OPERATOR_ACCOUNT_STATUS_CHANGED } from 'utils/EventEmitter';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import HideDetails from 'components/HideDetails';
import ShortLoader from 'components/ShortLoader';
import OperatorProfileTab from './routes/OperatorProfileTab';
import OperatorFeedsTab from './routes/OperatorFeedsTab';
import OperatorSalesRulesTab from './routes/OperatorSalesRulesTab';
import OperatorHeader from './components/OperatorHeader';
import OperatorAccountStatus from './components/OperatorAccountStatus';
import OperatorRegistrationInfo from './components/OperatorRegistrationInfo';
import OperatorPersonalInfo from './components/OperatorPersonalInfo';
import OperatorAdditionalInfo from './components/OperatorAdditionalInfo';
import { useOperatorQuery } from './graphql/__generated__/OperatorQuery';
import './Operator.scss';

const Operator = ({ match: { path, url } }: RouteComponentProps) => {
  const { id: uuid } = useParams<{ id: string }>();

  // ===== Requests ===== //
  const { data, loading, refetch } = useOperatorQuery({ variables: { uuid }, fetchPolicy: 'network-only' });

  const operator = data?.operator;

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(OPERATOR_ACCOUNT_STATUS_CHANGED, refetch);

    return () => {
      EventEmitter.off(OPERATOR_ACCOUNT_STATUS_CHANGED, refetch);
    };
  }, []);

  if (loading) {
    return <ShortLoader />;
  }

  if (!operator) {
    return <NotFound />;
  }

  const isSalesOperator = isSales(operator.userType as userTypes);
  const authorities = operator.authorities || [];

  return (
    <div className="Operator">
      <OperatorHeader operator={operator} />

      <div className="Operator__content">
        <div className="Operator__info">
          <OperatorAccountStatus operator={operator} />

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
          <Switch>
            <Route
              path={`${path}/profile`}
              component={() => <OperatorProfileTab operator={operator} onRefetch={refetch} />}
            />
            <Route path={`${path}/feed`} component={OperatorFeedsTab} />

            <If condition={isSalesOperator}>
              <Route path={`${path}/sales-rules`} component={OperatorSalesRulesTab} />
            </If>

            <Redirect to={`${url}/profile`} />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(Operator);
