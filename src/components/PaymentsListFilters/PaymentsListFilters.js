import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { get, intersection } from 'lodash';
import { Field } from 'formik';
import { compose, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withRequests } from 'apollo';
import { getActiveBrandConfig } from 'config';
import PropTypes from 'constants/propTypes';
import {
  aggregators,
  aggregatorsLabels,
  statuses as tradingStatuses,
  statusesLabels as tradingStatusesLabels,
  tradingTypes,
  tradingTypesLabelsWithColor,
} from 'constants/payment';
import { accountTypes } from 'constants/accountTypes';
import { warningValues, warningLabels } from 'constants/warnings';
import { statuses as operatorsStasuses } from 'constants/operators';
import { filterSetTypes } from 'constants/filterSet';
import { getAvailablePlatformTypes } from 'utils/tradingAccount';
import formatLabel from 'utils/formatLabel';
import renderLabel from 'utils/renderLabel';
import countries from 'utils/countryList';
import { decodeNullValues } from 'components/Formik/utils';
import {
  FormikExtForm,
  FormikInputField,
  FormikSelectField,
  FormikDateRangeGroup,
} from 'components/Formik';
import { RangeGroup } from 'components/Forms';
import {
  DesksAndTeamsQuery,
  OperatorsQuery,
  PaymentMethodsQuery,
} from './graphql';
import './PaymentsListFilters.scss';

class PaymentsListFilters extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    desksAndTeamsQuery: PropTypes.query({
      hierarchy: PropTypes.shape({
        TEAM: PropTypes.arrayOf(PropTypes.hierarchyBranch),
        DESK: PropTypes.arrayOf(PropTypes.hierarchyBranch),
      }),
    }).isRequired,
    operatorsQuery: PropTypes.query({
      operators: PropTypes.shape({
        content: PropTypes.arrayOf(
          PropTypes.shape({
            uuid: PropTypes.string,
            fullName: PropTypes.string,
            operatorStatus: PropTypes.string,
          }),
        ),
      }),
    }).isRequired,
    paymentMethodsQuery: PropTypes.query({
      paymentMethods: PropTypes.paymentMethods,
    }).isRequired,
    partners: PropTypes.partnersList,
    partnersLoading: PropTypes.bool,
    paymentsLoading: PropTypes.bool,
    clientView: PropTypes.bool,
  };

  static defaultProps = {
    partners: null,
    partnersLoading: false,
    paymentsLoading: false,
    clientView: false,
  };

  filterOperatorsByBranch = ({ operators, uuids }) => (
    operators.filter((operator) => {
      const partnerBranches = operator.hierarchy?.parentBranches || [];
      const branches = partnerBranches.map(({ uuid }) => uuid);

      return intersection(branches, uuids).length;
    })
  )

  filterOperators = ({ desks, teams }) => {
    const {
      operatorsQuery,
      desksAndTeamsQuery,
    } = this.props;

    const operators = operatorsQuery.data?.operators?.content || [];

    if (teams && teams.length) {
      return this.filterOperatorsByBranch({ operators, uuids: teams });
    }

    if (desks && desks.length) {
      // If desk chosen -> find all teams of these desks to filter operators
      const teamsList = desksAndTeamsQuery.data?.userBranches?.TEAM || [];
      const teamsByDesks = teamsList.filter(team => desks.includes(team.parentBranch.uuid)).map(({ uuid }) => uuid);
      const uuids = [...desks, ...teamsByDesks];

      return this.filterOperatorsByBranch({ operators, uuids });
    }

    return operators;
  }

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
      partners,
      clientView,
      paymentsLoading,
      partnersLoading,
      desksAndTeamsQuery,
      location: { state },
      paymentMethodsQuery: {
        data: paymentMethodsData,
        loading: paymentMethodsLoading,
      },
      operatorsQuery: { loading: isOperatorsLoading },
      desksAndTeamsQuery: { loading: isDesksAndTeamsLoading },
    } = this.props;

    const paymentMethods = get(paymentMethodsData, 'paymentMethods') || [];

    const currencies = getActiveBrandConfig().currencies.supported;

    const platformTypes = getAvailablePlatformTypes();

    const desks = desksAndTeamsQuery.data?.userBranches?.DESK || [];
    const teams = desksAndTeamsQuery.data?.userBranches?.TEAM || [];

    return (
      <FormikExtForm
        enableReinitialize
        initialValues={state?.filters || {}}
        handleSubmit={this.handleSubmit}
        handleReset={this.handleReset}
        isDataLoading={paymentsLoading}
        filterSetType={filterSetTypes.PAYMENT}
      >
        {({ values }) => {
          const desksUuids = values.desks || [];
          const teamsByDesks = teams.filter(team => desksUuids.includes(team.parentBranch.uuid));
          const teamsOptions = desksUuids.length ? teamsByDesks : teams;
          const operatorsOptions = this.filterOperators(values);

          return (
            <Fragment>
              <Field
                name="searchParam"
                className="form-group filter-row__big"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.KEYWORD')}
                placeholder={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_PLACEHOLDERS.KEYWORD')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                withFocus
              />
              <If condition={!clientView}>
                <Field
                  name="countries"
                  className="form-group filter-row__medium"
                  label={I18n.t('PROFILE.LIST.FILTERS.COUNTRY')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  component={FormikSelectField}
                  searchable
                  withFocus
                  multiple
                >
                  {Object.keys(countries).map(value => (
                    <option key={value} value={value}>
                      {countries[value]}
                    </option>
                  ))}
                </Field>
              </If>
              <Field
                name="paymentAggregator"
                className="form-group filter-row__medium"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PAYMENT_AGGREGATOR')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                withAnyOption
                withFocus
              >
                {Object.keys(aggregators).map(value => (
                  <option key={value} value={value}>
                    {I18n.t(aggregatorsLabels[value])}
                  </option>
                ))}
              </Field>
              <Field
                name="paymentMethods"
                className="form-group filter-row__medium"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PAYMENT_METHOD')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                disabled={paymentMethodsLoading}
                component={FormikSelectField}
                searchable
                withFocus
                multiple
              >
                {paymentMethods.map(value => (
                  <option key={value} value={value}>
                    {formatLabel(value)}
                  </option>
                ))}
              </Field>
              <Field
                name="paymentTypes"
                className="form-group filter-row__medium"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                searchable
                withFocus
                multiple
              >
                {Object.keys(tradingTypes)
                  .filter(value => tradingTypesLabelsWithColor[value])
                  .map(value => (
                    <option key={value} value={value}>
                      {I18n.t(tradingTypesLabelsWithColor[value].label)}
                    </option>
                  ))}
              </Field>
              <Field
                name="statuses"
                className="form-group filter-row__medium"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.STATUSES')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                searchable
                withFocus
                multiple
              >
                {Object.keys(tradingStatuses).map(value => (
                  <option key={value} value={value}>
                    {I18n.t(renderLabel(value, tradingStatusesLabels))}
                  </option>
                ))}
              </Field>
              <FormikDateRangeGroup
                className="form-group filter-row__date-range"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.STATUS_DATE_RANGE')}
                periodKeys={{
                  start: 'statusChangedTimeFrom',
                  end: 'statusChangedTimeTo',
                }}
                withFocus
              />
              <Field
                name="desks"
                className="form-group filter-row__medium"
                label={I18n.t('PROFILE.LIST.FILTERS.DESKS')}
                placeholder={
                  I18n.t(
                    (!isDesksAndTeamsLoading && desks.length === 0)
                      ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                      : 'COMMON.SELECT_OPTION.ANY',
                  )
                }
                component={FormikSelectField}
                disabled={isDesksAndTeamsLoading || desks.length === 0}
                searchable
                withFocus
                multiple
              >
                {desks.map(({ uuid, name }) => (
                  <option key={uuid} value={uuid}>
                    {name}
                  </option>
                ))}
              </Field>
              <Field
                name="teams"
                className="form-group filter-row__medium"
                label={I18n.t('PROFILE.LIST.FILTERS.TEAMS')}
                placeholder={
                  I18n.t(
                    (!isDesksAndTeamsLoading && teamsOptions.length === 0)
                      ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                      : 'COMMON.SELECT_OPTION.ANY',
                  )
                }
                component={FormikSelectField}
                disabled={isDesksAndTeamsLoading || teamsOptions.length === 0}
                searchable
                withFocus
                multiple
              >
                {teamsOptions.map(({ uuid, name }) => (
                  <option key={uuid} value={uuid}>
                    {name}
                  </option>
                ))}
              </Field>
              <Field
                name="agentIds"
                className="form-group filter-row__medium"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ORIGINAL_AGENT')}
                placeholder={
                  I18n.t(
                    (!isOperatorsLoading && operatorsOptions.length === 0)
                      ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                      : 'COMMON.SELECT_OPTION.ANY',
                  )
                }
                component={FormikSelectField}
                disabled={isOperatorsLoading || operatorsOptions.length === 0}
                searchable
                withFocus
                multiple
              >
                {operatorsOptions.map(({ uuid, fullName, operatorStatus }) => (
                  <option
                    key={uuid}
                    value={uuid}
                    disabled={operatorStatus === operatorsStasuses.INACTIVE
                    || operatorStatus === operatorsStasuses.CLOSED}
                  >
                    {fullName}
                  </option>
                ))}
              </Field>
              <If condition={!clientView}>
                <Field
                  name="affiliateUuids"
                  className="form-group filter-row__medium"
                  label={I18n.t('PROFILE.LIST.FILTERS.AFFILIATES')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  component={FormikSelectField}
                  disabled={partnersLoading || !partners.length}
                  searchable
                  withFocus
                  multiple
                >
                  {[{ uuid: 'NONE', fullName: I18n.t('COMMON.NONE') }, ...partners].map(({ uuid, fullName }) => (
                    <option key={uuid} value={uuid}>
                      {fullName}
                    </option>
                  ))}
                </Field>
                <Field
                  name="currency"
                  className="form-group filter-row__medium"
                  label={I18n.t('COMMON.CURRENCY')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  component={FormikSelectField}
                  withAnyOption
                  withFocus
                >
                  {currencies.map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Field>
              </If>
              <Field
                name="accountType"
                className="form-group filter-row__medium"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
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
              <Field
                name="firstTimeDeposit"
                className="form-group filter-row__medium"
                label={I18n.t('PROFILE.LIST.FILTERS.FIRST_DEPOSIT')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                withAnyOption
                withFocus
              >
                <option key={0} value={true}>{I18n.t('COMMON.YES')}</option> {/* eslint-disable-line */}
                <option key={1} value={false}>{I18n.t('COMMON.NO')}</option>
              </Field>
              <Field
                name="warnings"
                className="form-group filter-row__medium"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.WARNING')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                withAnyOption
                withFocus
              >
                {Object.keys(warningValues).map(value => (
                  <option key={value} value={value}>
                    {I18n.t(warningLabels[value])}
                  </option>
                ))}
              </Field>
              <RangeGroup
                className="form-group filter-row__medium"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.AMOUNT')}
              >
                <Field
                  name="amountFrom"
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="0.0"
                  component={FormikInputField}
                  withFocus
                />
                <Field
                  name="amountTo"
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="0.0"
                  component={FormikInputField}
                  withFocus
                />
              </RangeGroup>
              <FormikDateRangeGroup
                className="form-group filter-row__date-range"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.CREATION_DATE_RANGE')}
                periodKeys={{
                  start: 'creationTimeFrom',
                  end: 'creationTimeTo',
                }}
                withFocus
              />
              <FormikDateRangeGroup
                className="form-group filter-row__date-range"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.MODIFICATION_DATE_RANGE')}
                periodKeys={{
                  start: 'modificationTimeFrom',
                  end: 'modificationTimeTo',
                }}
                withFocus
              />
            </Fragment>
          );
        }
      }
      </FormikExtForm>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withRequests({
    desksAndTeamsQuery: DesksAndTeamsQuery,
    operatorsQuery: OperatorsQuery,
    paymentMethodsQuery: PaymentMethodsQuery,
  }),
)(PaymentsListFilters);
