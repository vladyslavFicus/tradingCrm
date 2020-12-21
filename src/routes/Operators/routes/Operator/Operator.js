import React, { PureComponent, Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { withRequests } from 'apollo';
import { operatorTabs } from 'config/menu';
import PropTypes from 'constants/propTypes';
import { isSales } from 'constants/hierarchyTypes';
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
import OperatorQuery from './graphql/OperatorQuery';
import './Operator.scss';

class Operator extends PureComponent {
  static propTypes = {
    operatorQuery: PropTypes.query({
      operator: PropTypes.operator,
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(OPERATOR_ACCOUNT_STATUS_CHANGED, this.onOperatorAccountStatusChangeEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(OPERATOR_ACCOUNT_STATUS_CHANGED, this.onOperatorAccountStatusChangeEvent);
  }

  onOperatorAccountStatusChangeEvent = () => {
    this.props.operatorQuery.refetch();
  }

  render() {
    const {
      operatorQuery,
      match: { path, url },
    } = this.props;

    const operator = operatorQuery.data?.operator || {};
    const operatorError = operatorQuery.error || false;
    const isSalesOperator = isSales(operator.hierarchy?.userType);
    const authorities = operator.authorities || [];
    const isLoading = operatorQuery.loading;

    if (operatorError) {
      return <NotFound />;
    }

    if (isLoading) {
      return <ShortLoader />;
    }

    return (
      <div className="Operator">
        <div className="Operator__content">
          <OperatorHeader operator={operator} />

          <div className="Operator__info">
            <OperatorAccountStatus operator={operator} />
            <OperatorRegistrationInfo registrationDate={operator?.registrationDate} />
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
              <Route path={`${path}/profile`} component={OperatorProfileTab} />

              <If condition={isSalesOperator}>
                <Route path={`${path}/sales-rules`} component={OperatorSalesRulesTab} />
              </If>

              <Route path={`${path}/feed`} component={OperatorFeedsTab} />

              <Redirect to={`${url}/profile`} />
            </Switch>
          </Suspense>
        </div>
      </div>
    );
  }
}

export default withRequests({
  operatorQuery: OperatorQuery,
})(Operator);
