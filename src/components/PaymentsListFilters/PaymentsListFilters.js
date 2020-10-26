import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import classNames from 'classnames';
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
  statusMapper,
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
  HierarchyQuery,
  OperatorsQuery,
  PaymentMethodsQuery,
  usersByBranchQuery,
} from './graphql';
import './PaymentsListFilters.scss';

class PaymentsListFilters extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    hierarchyQuery: PropTypes.query({
      userBranches: PropTypes.shape({
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
    accountType: PropTypes.string,
    partners: PropTypes.partnersList,
    partnersLoading: PropTypes.bool,
    paymentsLoading: PropTypes.bool,
    clientView: PropTypes.bool,
  };

  static defaultProps = {
    accountType: 'LIVE',
    partners: null,
    partnersLoading: false,
    paymentsLoading: false,
    clientView: false,
  };

  state = {
    filteredTeams: null,
    filteredOperators: null,
    disabledFilteredOperators: false,
  };

  filterOperators = async (uuids, setFieldValue) => {
    setFieldValue('agentIds', null);

    this.setState({
      disabledFilteredOperators: true,
    });

    try {
      const { data: { usersByBranch } } = await this.props.client.query({
        query: usersByBranchQuery,
        variables: { uuids },
      });

      this.setState({
        filteredOperators: usersByBranch || [],
        disabledFilteredOperators: false,
      });
    } catch {
      this.setState({
        filteredOperators: [],
        disabledFilteredOperators: true,
      });
    }
  };

  isValueInForm = (formValues, field) => formValues && formValues[field];

  mapTeamsByDesks = (desks) => {
    const {
      hierarchyQuery: { data: hierarchyData },
    } = this.props;

    const teams = get(hierarchyData, 'userBranches.TEAM') || [];

    return teams.filter(({ parentBranch: { uuid } }) => desks.includes(uuid));
  }

  handleBranchChange = (fieldName, value, setFieldValue, formValues) => {
    if (fieldName === 'desks') {
      const filteredTeams = value ? this.mapTeamsByDesks(value) : null;

      this.setState(
        { filteredTeams },
        value ? () => setFieldValue('teams', null) : null,
      );
    }

    switch (true) {
      case !!value: {
        this.filterOperators(value, setFieldValue);
        break;
      }
      case fieldName === 'teams' && this.isValueInForm(formValues, 'desks'): {
        this.filterOperators(formValues.desks, setFieldValue);
        break;
      }
      case fieldName === 'desks' && this.isValueInForm(formValues, 'teams'): {
        this.filterOperators(formValues.teams, setFieldValue);
        break;
      }
      default:
        this.setState({ filteredOperators: null });
    }

    setFieldValue(fieldName, value);
  };

  handleFormChange = (data = {}) => {
    const {
      amountFrom,
      amountTo,
      desks,
      teams,
      ...filters
    } = data;
    let statuses = null;

    if (Array.isArray(filters.statuses)) {
      statuses = filters.statuses.map(item => statusMapper[item]).flat(Infinity);
    }

    this.props.history.replace({
      query: {
        filters: decodeNullValues({
          ...filters,
          ...(statuses && { statuses }),
          ...(amountFrom && { amountFrom }),
          ...(amountTo && { amountTo }),
          desks,
          teams: desks && !teams
            ? this.mapTeamsByDesks(desks).map(({ uuid }) => uuid)
            : teams,
        }),
      },
    });
  };

  handleFormReset = () => {
    this.setState(
      {
        filteredTeams: null,
        filteredOperators: null,
        disabledFilteredOperators: false,
      },
      () => this.props.history.replace({}),
    );
  };

  render() {
    const {
      hierarchyQuery: { data: hierarchyData, loading: hierarchyLoading },
      operatorsQuery: { data: operatorsData, loading: operatorsLoading },
      paymentMethodsQuery: {
        data: paymentMethodsData,
        loading: paymentMethodsLoading,
      },
      accountType,
      partners,
      partnersLoading,
      paymentsLoading,
      clientView,
    } = this.props;

    const {
      filteredTeams,
      filteredOperators,
      disabledFilteredOperators,
    } = this.state;

    const teams = filteredTeams || get(hierarchyData, 'userBranches.TEAM') || [];
    const desks = get(hierarchyData, 'userBranches.DESK') || [];

    const operators = filteredOperators || get(operatorsData, 'operators.content') || [];
    const disabledOperators = operatorsLoading || disabledFilteredOperators;

    const paymentMethods = get(paymentMethodsData, 'paymentMethods') || [];

    const currencies = getActiveBrandConfig().currencies.supported;

    const platformTypes = getAvailablePlatformTypes();

    return (
      <FormikExtForm
        initialValues={{
          accountType,
        }}
        handleSubmit={this.handleFormChange}
        handleReset={this.handleFormReset}
        isDataLoading={paymentsLoading}
        filterSetType={filterSetTypes.PAYMENT}
      >
        {({ values, setFieldValue }) => (
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
                hierarchyLoading || !desks.length
                  ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                  : I18n.t('COMMON.SELECT_OPTION.ANY')
              }
              component={FormikSelectField}
              disabled={hierarchyLoading || !desks.length}
              customOnChange={value => this.handleBranchChange('desks', value, setFieldValue, values)}
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
                hierarchyLoading || !teams.length
                  ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                  : I18n.t('COMMON.SELECT_OPTION.ANY')
              }
              component={FormikSelectField}
              disabled={hierarchyLoading || !teams.length}
              customOnChange={value => this.handleBranchChange('teams', value, setFieldValue, values)}
              searchable
              withFocus
              multiple
            >
              {teams.map(({ uuid, name }) => (
                <option key={uuid} value={uuid}>
                  {name}
                </option>
              ))}
            </Field>
            <Field
              name="agentIds"
              className="form-group filter-row__medium"
              label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ORIGINAL_AGENT')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSelectField}
              disabled={disabledOperators}
              searchable
              withFocus
              multiple
            >
              {operators.map(({ fullName, uuid, operatorStatus }) => (
                <option
                  key={uuid}
                  value={uuid}
                  className={classNames({
                    'color-inactive': operatorStatus === operatorsStasuses.INACTIVE
                    || operatorStatus === operatorsStasuses.CLOSED,
                  })}
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
              {[
                { label: 'COMMON.YES', value: true },
                { label: 'COMMON.NO', value: false },
              ].map(({ value, label }) => (
                <option key={value} value={value}>
                  {I18n.t(label)}
                </option>
              ))}
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
        )}
      </FormikExtForm>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withRequests({
    hierarchyQuery: HierarchyQuery,
    operatorsQuery: OperatorsQuery,
    paymentMethodsQuery: PaymentMethodsQuery,
  }),
)(PaymentsListFilters);
