import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
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
import { RangeGroup } from 'components/Forms';
import { Button } from 'components/UI';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
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
  };

  handleApplyFilters = (values) => {
    this.props.history.replace({
      query: {
        filters: {
          ...values,
          ...values.tradeId && { tradeId: Number(values.tradeId) },
          ...values.volumeFrom && { volumeFrom: Number(values.volumeFrom) },
          ...values.volumeTo && { volumeTo: Number(values.volumeTo) },
        },
      },
    });
  };

  handleFilterReset = () => {
    this.props.history.replace({
      query: { filters: {} },
    });
  };

  render() {
    const {
      operatorsQuery: {
        data: operatorsData,
        loading: operatorsLoading,
      },
      tradingAccountsQuery: {
        data: tradingAccountsData,
        loading: tradingAccountsLoading,
      },
    } = this.props;

    const accounts = get(tradingAccountsData, 'clientTradingAccounts') || [];
    const originalAgents = get(operatorsData, 'operators.content') || [];
    const disabledOriginalAgentField = operatorsLoading;

    return (
      <Formik
        initialValues={{ tradeType: 'LIVE' }}
        onSubmit={this.handleApplyFilters}
        onReset={this.handleFilterReset}
      >
        {({ handleReset, dirty, isSubmitting }) => (
          <Form className="filter__form">
            <div className="filter__form-inputs">
              <Field
                name="tradeId"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TRADE_LABEL')}
                placeholder={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TRADE_PLACEHOLDER')}
                className="filter-row__big"
                component={FormikInputField}
              />
              <Field
                name="loginIds"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.LOGIN_IDS')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ALL')}
                className="filter-row__medium"
                component={FormikSelectField}
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
                multiple
              >
                {originalAgents.map(({ fullName, uuid, operatorStatus }) => (
                  <option
                    key={uuid}
                    value={uuid}
                    className={operatorStatus === operatorsStasuses.INACTIVE
                      || operatorStatus === operatorsStasuses.CLOSE
                      ? 'color-inactive'
                      : ''
                    }
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
                />
                <Field
                  name="volumeTo"
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="0"
                  component={FormikInputField}
                />
              </RangeGroup>
              <Field
                name="status"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUS_LABEL')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="filter-row__medium"
                component={FormikSelectField}
                withAnyOption
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
              >
                {accountTypes.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Field>
              <FormikDateRangeGroup
                className="form-group filter-row__date-range"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.OPEN_TIME_RANGE_LABEL')}
                periodKeys={{
                  start: 'openTimeStart',
                  end: 'openTimeEnd',
                }}
              />
              <FormikDateRangeGroup
                className="form-group filter-row__date-range"
                label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.CLOSE_TIME_RANGE_LABEL')}
                periodKeys={{
                  start: 'closeTimeStart',
                  end: 'closeTimeEnd',
                }}
              />
            </div>
            <div className="filter__form-buttons">
              <Button
                className="margin-right-15"
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || tradingAccountsLoading}
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
