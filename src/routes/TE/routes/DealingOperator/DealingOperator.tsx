import React, { Suspense, useEffect } from 'react';
import I18n from 'i18n-js';
import { Switch, Redirect, useRouteMatch, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import ShortLoader from 'components/ShortLoader';
import HideDetails from 'components/HideDetails';
import NotFound from 'routes/NotFound';
import EventEmitter, { OPERATOR_RELOAD } from 'utils/EventEmitter';
import { dealingOperatorTabs } from './constants';
import DealingOperatorRegistrationInfo from './components/DealingOperatorRegistrationInfo';
import DealingOperatorHeader from './components/DealingOperatorHeader';
import DealingOperatorPersonalInfo from './components/DealingOperatorPersonalInfo';
import DealingOperatorAdditionalInfo from './components/DealingOperatorAdditionalInfo';
import DealingOperatorAccountStatus from './components/DealingOperatorAccountStatus';
import { useOperatorProfileQuery, OperatorProfileQuery } from './graphql/__generated__/OperatorProfileQuery';
import DealingOperatorProfileTab from './routes/DealingOperatorProfileTab';
import DealingOperatorFeedTab from './routes/DealingOperatorFeedTab';
import './DealingOperator.scss';

export type Operator = OperatorProfileQuery['tradingEngine']['operator']

const DealingOperator = () => {
  const { path, url } = useRouteMatch();
  const { id: uuid } = useParams<{ id: string }>();
  const operatorQuery = useOperatorProfileQuery({ variables: { uuid } });
  const operator = operatorQuery.data?.tradingEngine.operator as Operator;

  useEffect(() => {
    EventEmitter.on(OPERATOR_RELOAD, operatorQuery.refetch);

    return () => {
      EventEmitter.off(OPERATOR_RELOAD, operatorQuery.refetch);
    };
  }, []);

  if (operatorQuery.error) {
    return <NotFound />;
  }

  return (
    <div className="DealingOperator">
      <Helmet title={I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.TITLE')} />

      <Choose>
        <When condition={operatorQuery.loading}>
          <ShortLoader />
        </When>
        <Otherwise>
          <DealingOperatorHeader operator={operator} />
          <div className="DealingOperator__content">
            <div className="DealingOperator__info">
              <DealingOperatorAccountStatus operator={operator} />
              <DealingOperatorRegistrationInfo operator={operator} />
            </div>

            <HideDetails>
              <div className="DealingOperator__details">
                <DealingOperatorPersonalInfo operator={operator} />
                <DealingOperatorAdditionalInfo operator={operator} />
              </div>
            </HideDetails>
          </div>

          <Tabs items={dealingOperatorTabs} />

          <div className="DealingOperator__tab-content">
            <Suspense fallback={null}>
              <Switch>
                <Route
                  path={`${path}/profile`}
                  component={DealingOperatorProfileTab}
                />
                <Route
                  path={`${path}/feed`}
                  component={DealingOperatorFeedTab}
                />
                <Redirect to={`${url}/profile`} />
              </Switch>
            </Suspense>
          </div>
        </Otherwise>
      </Choose>
    </div>
  );
};

export default React.memo(DealingOperator);