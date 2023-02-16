import React from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { intersection, omit } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { getBrand } from 'config';
import { State } from 'types';
import {
  aggregators,
  aggregatorsLabels,
  statuses as tradingStatuses,
  statusesLabels as tradingStatusesLabels,
  tradingTypes,
  tradingTypesLabels,
} from 'constants/payment';
import { accountTypes } from 'constants/accountTypes';
import { warningValues, warningLabels } from 'constants/warnings';
import { statuses as operatorsStasuses } from 'constants/operators';
import { filterSetTypes } from 'constants/filterSet';
import { getAvailablePlatformTypes } from 'utils/tradingAccount';
import formatLabel from 'utils/formatLabel';
import countries from 'utils/countryList';
import enumToArray from 'utils/enumToArray';
import { decodeNullValues } from 'components/Formik/utils';
import {
  FormikInputField,
  FormikSelectField,
  FormikDateRangePicker,
} from 'components/Formik';
import { RangeGroup } from 'components/Forms';
import FiltersToggler from 'components/FiltersToggler';
import FilterSetsDecorator, { FilterSetsButtons } from 'components/FilterSetsDecorator';
import { Button, RefreshButton } from 'components/Buttons';
import { firstTimeDepositFilter } from './constants';
import { useOperatorsQuery } from './graphql/__generated__/OperatorsQuery';
import { useDesksAndTeamsQuery } from './graphql/__generated__/DesksAndTeamsQuery';
import { usePaymentMethodsQuery } from './graphql/__generated__/PaymentMethodsQuery';
import './PaymentsListFilters.scss';

type FormValues = {
  searchParam?: string,
  paymentAggregator?: string,
  paymentMethods?: Array<string>,
  paymentTypes?: Array<string>,
  statuses?: Array<string>,
  statusChangedTimeFrom?: string,
  statusChangedTimeTo?: string,
  desks?: Array<string>,
  teams?: Array<string>,
  agentIds?: Array<string>,
  currency?: string,
  accountType?: string,
  platformType?: string,
  firstTimeDeposit?: boolean,
  warnings?: Array<string>,
  amountFrom?: number,
  amountTo?: number,
  creationTimeFrom?: string,
  creationTimeTo?: string,
  modificationTimeFrom?: string,
  modificationTimeTo?: string,
  countries?: Array<string>,
  affiliateUuids?: Array<string>,
};

type Props = {
  paymentsLoading: boolean,
  clientView?: boolean,
  partners?: Array<any>,
  partnersLoading?: boolean,
  onRefetch: () => void,
};

const PaymentsListFilters = (props: Props) => {
  const { partners = [], partnersLoading = false, paymentsLoading, clientView, onRefetch } = props;

  const { state } = useLocation<State<FormValues>>();

  const history = useHistory();

  // ===== Requests ===== //
  const operatorsQuery = useOperatorsQuery({
    variables: {
      page: {
        sorts: [
          { column: 'operatorStatus', direction: 'ASC' },
          { column: 'firstName', direction: 'ASC' },
          { column: 'lastName', direction: 'ASC' },
        ],
      },
    },
    fetchPolicy: 'cache-and-network',
    context: { batch: false },
  });

  const { data: operatorsData, loading: operatorsLoading } = operatorsQuery;
  const operators = operatorsData?.operators?.content || [];

  const desksAndTeamsQuery = useDesksAndTeamsQuery();
  const { loading: desksAndTeamsLoading } = desksAndTeamsQuery;

  const desksList = desksAndTeamsQuery.data?.userBranches?.DESK || [];
  const teamsList = desksAndTeamsQuery.data?.userBranches?.TEAM || [];

  const paymentMethodsQuery = usePaymentMethodsQuery();
  const { data: paymentMethodsData, loading: paymentMethodsLoading } = paymentMethodsQuery;

  const paymentMethods = paymentMethodsData?.paymentMethods || [];

  const currencies = getBrand().currencies.supported;

  const platformTypes = getAvailablePlatformTypes();

  const checkIsDirty = (values: FormValues) => (
    !(Object.keys(values).length === 1 && values.accountType === 'LIVE')
  );

  const omitFilterValues = (values: FormValues) => {
    if (clientView) {
      return omit(values, ['countries', 'affiliateUuids']);
    }

    return values;
  };

  const filterOperatorsByBranch = (uuids: Array<string>) => (
    operators.filter((operator) => {
      const partnerBranches = operator?.hierarchy?.parentBranches || [];
      const branches = partnerBranches.map(({ uuid }) => uuid);

      return intersection(branches, uuids).length;
    })
  );

  const filterOperators = ({ desks, teams }: FormValues) => {
    if (teams && teams.length) {
      return filterOperatorsByBranch(teams);
    }

    if (desks && desks.length) {
      // If desk chosen -> find all teams of these desks to filter operators
      const teamsByDesks = teamsList
        .filter(team => team.parentBranch && desks.includes(team.parentBranch.uuid)).map(({ uuid }) => uuid);
      const uuids = [...desks, ...teamsByDesks];

      return filterOperatorsByBranch(uuids);
    }

    return operators;
  };

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues) => {
    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(omitFilterValues(values)),
      },
    });
  };

  const handleReset = () => {
    if (paymentsLoading) return;

    history.replace({
      state: {
        ...state,
        filters: null,
        selectedFilterSet: null,
      },
    });
  };

  return (
    <FiltersToggler>
      <Formik
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={state?.filters || { accountType: 'LIVE' }}
      >
        {({ values, setValues, isSubmitting, dirty }) => {
          const desksUuids = values.desks || [];
          const teamsByDesks = teamsList
            .filter(team => team.parentBranch && desksUuids.includes(team.parentBranch?.uuid));
          const teamsOptions = desksUuids.length ? teamsByDesks : teamsList;
          const operatorsOptions = filterOperators(values);

          return (
            <FilterSetsDecorator
              // @ts-ignore Component withRouter HOC types issue
              filterSetType={filterSetTypes.PAYMENT}
              currentValues={values}
              disabled={paymentsLoading}
              submitFilters={(filterValues: FormValues) => {
                setValues(filterValues);
                handleSubmit(filterValues);
              }}
            >
              <Form className="PaymentsListFilters__form">
                <div className="PaymentsListFilters__fields">
                  <Field
                    name="searchParam"
                    className="PaymentsListFilters__field PaymentsListFilters__search"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.KEYWORD')}
                    placeholder={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_PLACEHOLDERS.KEYWORD')}
                    addition={<i className="icon icon-search" />}
                    component={FormikInputField}
                    withFocus
                  />

                  <Field
                    className="PaymentsListFilters__field PaymentsListFilters__date-range"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.CREATION_DATE_RANGE')}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'creationTimeFrom',
                      to: 'creationTimeTo',
                    }}
                    withFocus
                  />

                  <Field
                    className="PaymentsListFilters__field PaymentsListFilters__date-range"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.MODIFICATION_DATE_RANGE')}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'modificationTimeFrom',
                      to: 'modificationTimeTo',
                    }}
                    withFocus
                  />

                  <Field
                    className="PaymentsListFilters__field PaymentsListFilters__date-range"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.STATUS_DATE_RANGE')}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'statusChangedTimeFrom',
                      to: 'statusChangedTimeTo',
                    }}
                    withFocus
                  />

                  <Field
                    name="paymentAggregator"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PAYMENT_AGGREGATOR')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {enumToArray(aggregators).map(value => (
                      <option key={value} value={value}>
                        {I18n.t(aggregatorsLabels[value])}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="paymentMethods"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
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
                        {formatLabel(value, false)}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="paymentTypes"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.TYPE')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    searchable
                    withFocus
                    multiple
                  >
                    {Object.keys(tradingTypes)
                      .filter(value => tradingTypesLabels[value])
                      .map(value => (
                        <option key={value} value={value}>
                          {I18n.t(tradingTypesLabels[value])}
                        </option>
                      ))}
                  </Field>

                  <Field
                    name="statuses"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.STATUSES')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    searchable
                    withFocus
                    multiple
                  >
                    {enumToArray(tradingStatuses).map(value => (
                      <option key={value} value={value}>
                        {I18n.t(tradingStatusesLabels[value])}
                      </option>
                    ))}
                  </Field>


                  <If condition={!clientView}>
                    <Field
                      name="countries"
                      className="PaymentsListFilters__field PaymentsListFilters__select"
                      label={I18n.t('PROFILE.LIST.FILTERS.COUNTRY')}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                      component={FormikSelectField}
                      searchable
                      withFocus
                      multiple
                    >
                      {[
                        <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
                        ...Object.keys(countries)
                          .map(country => (
                            <option key={country} value={country}>{countries[country]}</option>
                          )),
                      ]}
                    </Field>

                    <Field
                      name="affiliateUuids"
                      className="PaymentsListFilters__field PaymentsListFilters__select"
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
                  </If>

                  <Field
                    name="desks"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    label={I18n.t('PROFILE.LIST.FILTERS.DESKS')}
                    placeholder={
                      I18n.t(
                        (!desksAndTeamsLoading && desksList.length === 0)
                          ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                          : 'COMMON.SELECT_OPTION.ANY',
                      )
                    }
                    component={FormikSelectField}
                    disabled={desksAndTeamsLoading || desksList.length === 0}
                    searchable
                    withFocus
                    multiple
                  >
                    {desksList.map(({ uuid, name }) => (
                      <option key={uuid} value={uuid}>
                        {name}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="teams"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    label={I18n.t('PROFILE.LIST.FILTERS.TEAMS')}
                    placeholder={
                      I18n.t(
                        (!desksAndTeamsLoading && teamsOptions.length === 0)
                          ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                          : 'COMMON.SELECT_OPTION.ANY',
                      )
                    }
                    component={FormikSelectField}
                    disabled={desksAndTeamsLoading || teamsOptions.length === 0}
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
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ORIGINAL_AGENT')}
                    placeholder={
                      I18n.t(
                        (!operatorsLoading && operatorsOptions.length === 0)
                          ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                          : 'COMMON.SELECT_OPTION.ANY',
                      )
                    }
                    component={FormikSelectField}
                    disabled={operatorsLoading || operatorsOptions.length === 0}
                    searchable
                    withFocus
                    multiple
                  >
                    {operatorsOptions.map(({ uuid, fullName, operatorStatus }) => (
                      <option
                        key={uuid}
                        value={uuid}
                        className={classNames('PaymentsListFilters__select-option', {
                          'PaymentsListFilters__select-option--inactive': operatorStatus !== operatorsStasuses.ACTIVE,
                        })}
                      >
                        {fullName}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="accountType"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ACCOUNT_TYPE')}
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
                      className="PaymentsListFilters__field PaymentsListFilters__select"
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
                    name="warnings"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.WARNING')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {enumToArray(warningValues).map(value => (
                      <option key={value} value={value}>
                        {I18n.t(warningLabels[value])}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="firstTimeDeposit"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    label={I18n.t('PROFILE.LIST.FILTERS.FIRST_DEPOSIT')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {firstTimeDepositFilter.map(({ value, label }) => (
                      // @ts-ignore because in tsx file Field can't set BOOLEAN to option value
                      <option key={`firstTimeDeposit-${value}`} value={value}>
                        {I18n.t(label)}
                      </option>
                    ))}
                  </Field>

                  <RangeGroup
                    className="PaymentsListFilters__field PaymentsListFilters__range-inputs"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.AMOUNT')}
                  >
                    <Field
                      name="amountFrom"
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="0.0"
                      component={FormikInputField}
                      className="PaymentsListFilters__field"
                      withFocus
                    />

                    <Field
                      name="amountTo"
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="0.0"
                      component={FormikInputField}
                      className="PaymentsListFilters__field"
                      withFocus
                    />
                  </RangeGroup>

                  <Field
                    name="currency"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    label={I18n.t('COMMON.CURRENCY')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {currencies.map((value: string) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className="PaymentsListFilters__buttons">
                  <FilterSetsButtons />

                  <div className="PaymentsListFilters__buttons-group">
                    <RefreshButton
                      onClick={onRefetch}
                      className="PaymentsListFilters__button"
                    />

                    <Button
                      onClick={handleReset}
                      className="PaymentsListFilters__button"
                      disabled={paymentsLoading || isSubmitting || !checkIsDirty(values)}
                      primary
                    >
                      {I18n.t('COMMON.RESET')}
                    </Button>

                    <Button
                      type="submit"
                      className="PaymentsListFilters__button"
                      disabled={paymentsLoading || isSubmitting || !dirty}
                      primary
                    >
                      {I18n.t('COMMON.APPLY')}
                    </Button>
                  </div>
                </div>
              </Form>
            </FilterSetsDecorator>
          );
        }
      }
      </Formik>
    </FiltersToggler>
  );
};

export default React.memo(PaymentsListFilters);
