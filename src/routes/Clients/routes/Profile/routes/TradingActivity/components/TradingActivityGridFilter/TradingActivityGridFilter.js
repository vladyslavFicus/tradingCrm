import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { accountTypes } from 'constants/accountTypes';
import { statuses as operatorsStasuses } from 'constants/operators';
import {
  FormikInputField,
  FormikSelectField,
  FormikDateRangeGroup,
} from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { RangeGroup } from 'components/Forms';
import { Button, RefreshButton } from 'components/UI';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import { getAvailablePlatformTypes } from 'utils/tradingAccount';
import {
  types,
  symbols,
  statuses,
} from '../../attributes/constants';
import {
  TradingAccountsQuery,
  OperatorsQuery,
} from './graphql';

class TradingActivityGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    tradingAccountsQuery: PropTypes.query({
      clientTradingAccounts: PropTypes.arrayOf(PropTypes.tradingAccount),
    }).isRequired,
    operatorsQuery: PropTypes.query({
      operators: PropTypes.pageable(PropTypes.tradingActivityOriginalAgent),
    }).isRequired,
    handleRefetch: PropTypes.func.isRequired,
  };

  handleSubmit = (values) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  handleReset = () => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });
  };

  render() {
    const {
      location: { state },
      operatorsQuery: {
        data: operatorsData,
        loading: operatorsLoading,
      },
      tradingAccountsQuery: {
        data: tradingAccountsData,
        loading: tradingAccountsLoading,
      },
      handleRefetch,
    } = this.props;

    const accounts = get(tradingAccountsData, 'clientTradingAccounts') || [];
    const originalAgents = get(operatorsData, 'operators.content') || [];
    const disabledOriginalAgentField = operatorsLoading;

    const platformTypes = getAvailablePlatformTypes();

    return (
      <Formik
        enableReinitialize
        initialValues={state?.filters || { tradeType: 'LIVE' }}
        onSubmit={this.handleSubmit}
      >
        {({ dirty, isSubmitting }) => (
          <Form className="filter__form">
            <div className="filter__form-inputs">
              <Field
                name="tradeId"
                type="number"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TRADE_LABEL')}
                placeholder={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TRADE_PLACEHOLDER')}
                className="filter-row__big"
                component={FormikInputField}
                addition={<i className="icon icon-search" />}
                withFocus
              />
              <Field
                name="loginIds"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.LOGIN_IDS')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ALL')}
                className="filter-row__medium"
                component={FormikSelectField}
                disabled={accounts.length === 0}
                withFocus
                multiple
              >
                {accounts.map(({ login, platformType }) => (
                  <option key={login} value={login}>
                    <PlatformTypeBadge platformType={platformType} center>
                      {login}
                    </PlatformTypeBadge>
                  </option>
                ))}
              </Field>
              <Field
                name="operationType"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPE_LABEL')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="filter-row__medium"
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
              >
                {types.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Field>
              <Field
                name="symbol"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOL_LABEL')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="filter-row__medium"
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
              >
                {symbols.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Field>
              <Field
                name="agentIds"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.ORIGINAL_AGENT_LABEL')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="filter-row__medium"
                component={FormikSelectField}
                disabled={disabledOriginalAgentField}
                searchable
                withFocus
                multiple
              >
                {originalAgents.map(({ fullName, uuid, operatorStatus }) => (
                  <option
                    key={uuid}
                    value={uuid}
                    className={classNames({
                      'color-inactive': operatorStatus !== operatorsStasuses.ACTIVE,
                    })}
                  >
                    {fullName}
                  </option>
                ))}
              </Field>
              <RangeGroup
                className="form-group filter-row__medium"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.VOLUME_LABEL')}
              >
                <Field
                  name="volumeFrom"
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="0"
                  component={FormikInputField}
                  withFocus
                />
                <Field
                  name="volumeTo"
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="0"
                  component={FormikInputField}
                  withFocus
                />
              </RangeGroup>
              <Field
                name="status"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUS_LABEL')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="filter-row__medium"
                component={FormikSelectField}
                withAnyOption
                withFocus
              >
                {statuses.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Field>
              <Field
                name="tradeType"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ACCOUNT_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="filter-row__medium"
                component={FormikSelectField}
                withAnyOption
                withFocus
              >
                {accountTypes.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Field>
              <If condition={platformTypes.length > 1}>
                <Field
                  name="platformType"
                  label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PLATFORM_TYPE')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  className="form-group filter-row__medium"
                  component={FormikSelectField}
                  withAnyOption
                  withFocus
                >
                  {platformTypes.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Field>
              </If>
              <FormikDateRangeGroup
                className="form-group filter-row__date-range"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.OPEN_TIME_RANGE_LABEL')}
                periodKeys={{
                  start: 'openTimeStart',
                  end: 'openTimeEnd',
                }}
                withFocus
              />
              <FormikDateRangeGroup
                className="form-group filter-row__date-range"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.CLOSE_TIME_RANGE_LABEL')}
                periodKeys={{
                  start: 'closeTimeStart',
                  end: 'closeTimeEnd',
                }}
                withFocus
              />
            </div>
            <div className="filter__form-buttons">
              <RefreshButton
                className="margin-right-15"
                onClick={handleRefetch}
              />
              <Button
                className="margin-right-15"
                onClick={this.handleReset}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                type="submit"
                disabled={!dirty || isSubmitting || tradingAccountsLoading}
                primary
              >
                {I18n.t('COMMON.APPLY')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    tradingAccountsQuery: TradingAccountsQuery,
    operatorsQuery: OperatorsQuery,
  }),
)(TradingActivityGridFilter);
