import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Field, Form, Formik } from 'formik';
import { Utils } from '@crm/common';
import { Button, RefreshButton } from 'components';
import { FormikDateRangePicker, FormikInputField, FormikSelectField } from 'components/Formik';
import { RangeGroup } from 'components/Forms';
import { FiltersToggler } from 'components/FiltersToggler';
import { FilterSetsDecorator, FilterSetsButtons } from 'components/FilterSetsDecorator';
import TimeZoneField from 'components/TimeZoneField';
import { firstTimeDepositFilter } from 'components/PaymentsListFilters/constants';
import usePaymentsListFilters from 'components/PaymentsListFilters/hooks/usePaymentsListFilters';
import { FormValues } from 'components/PaymentsListFilters/types';
import { filterSetTypes } from 'constants/filterSet';
import { statuses as operatorsStasuses } from 'constants/operators';
import { warningLabels, warningValues } from 'constants/warnings';
import { accountTypes } from 'constants/accountTypes';
import {
  aggregators,
  aggregatorsLabels,
  statuses as tradingStatuses,
  statusesLabels as tradingStatusesLabels,
  tradingTypes,
  tradingTypesLabels,
} from 'constants/payment';
import './PaymentsListFilters.scss';

type Props = {
  paymentsLoading: boolean,
  clientView?: boolean,
  partners?: Array<any>,
  partnersLoading?: boolean,
  onRefetch: () => void,
};

const PaymentsListFilters = (props: Props) => {
  const { partners = [], partnersLoading = false, paymentsLoading, clientView, onRefetch } = props;

  const {
    initialValues,
    paymentSystemsProvider,
    operatorsLoading,
    desksAndTeamsLoading,
    teamsList,
    desksList,
    paymentMethodsLoading,
    paymentMethods,
    currencies,
    platformTypes,
    checkIsDirty,
    filterOperators,
    handleSubmit,
    handleReset,
  } = usePaymentsListFilters({ paymentsLoading, clientView });

  return (
    <FiltersToggler>
      <Formik
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={initialValues}
      >
        {({ values, setValues, handleSubmit: onSubmit, isSubmitting, dirty }) => {
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
                onSubmit();
              }}
            >
              <Form className="PaymentsListFilters__form">
                <div className="PaymentsListFilters__fields">
                  <Field
                    name="searchParam"
                    className="PaymentsListFilters__field PaymentsListFilters__search"
                    data-testid="PaymentsListFilters-searchParamInput"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.KEYWORD')}
                    placeholder={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_PLACEHOLDERS.KEYWORD')}
                    addition={<i className="icon icon-search" />}
                    component={FormikInputField}
                    withFocus
                  />

                  <Field
                    className="PaymentsListFilters__field PaymentsListFilters__date-range"
                    data-testid="PaymentsListFilters-creationTimeDateRangePicker"
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
                    data-testid="PaymentsListFilters-modificationTimeDateRangePicker"
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
                    data-testid="PaymentsListFilters-statusChangedTimeDateRangePicker"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.STATUS_DATE_RANGE')}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'statusChangedTimeFrom',
                      to: 'statusChangedTimeTo',
                    }}
                    withFocus
                  />

                  <If condition={!clientView}>
                    <TimeZoneField
                      className="PaymentsListFilters__field PaymentsListFilters__select"
                      data-testid="PaymentsListFilters-timeZone"
                    />
                  </If>

                  <Field
                    name="paymentAggregator"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-paymentAggregatorSelect"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PAYMENT_AGGREGATOR')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {Utils.enumToArray(aggregators).map(value => (
                      <option key={value} value={value}>
                        {I18n.t(aggregatorsLabels[value])}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="paymentMethods"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-paymentMethodsSelect"
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
                        {Utils.formatLabel(value, false)}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="bankName"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-bankNameSelect"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PAYMENT_SYSTEM')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withFocus
                    withGroup={{ firstTitle: 'COMMON.FAVORITE', secondTitle: 'COMMON.OTHER' }}
                  >
                    {paymentSystemsProvider.map(({ paymentSystem, isFavourite }) => (
                      <option key={paymentSystem} value={paymentSystem} data-isFavourite={isFavourite}>
                        {Utils.formatLabel(paymentSystem, false)}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="paymentTypes"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-paymentTypesSelect"
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
                    data-testid="PaymentsListFilters-statusesSelect"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.STATUSES')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    searchable
                    withFocus
                    multiple
                  >
                    {Utils.enumToArray(tradingStatuses).map(value => (
                      <option key={value} value={value}>
                        {I18n.t(tradingStatusesLabels[value])}
                      </option>
                    ))}
                  </Field>


                  <If condition={!clientView}>
                    <Field
                      name="countries"
                      className="PaymentsListFilters__field PaymentsListFilters__select"
                      data-testid="PaymentsListFilters-countriesSelect"
                      label={I18n.t('PROFILE.LIST.FILTERS.COUNTRY')}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                      component={FormikSelectField}
                      searchable
                      withFocus
                      multiple
                    >
                      {[
                        <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
                        ...Object.keys(Utils.countryList)
                          .map(country => (
                            <option key={country} value={country}>{Utils.countryList[country]}</option>
                          )),
                      ]}
                    </Field>

                    <Field
                      name="affiliateUuids"
                      className="PaymentsListFilters__field PaymentsListFilters__select"
                      data-testid="PaymentsListFilters-affiliateUuidsSelect"
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
                    data-testid="PaymentsListFilters-desksSelect"
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
                    data-testid="PaymentsListFilters-teamsSelect"
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
                    data-testid="PaymentsListFilters-agentIdsSelect"
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
                    data-testid="PaymentsListFilters-accountTypeSelect"
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
                      data-testid="PaymentsListFilters-platformTypeSelect"
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
                    data-testid="PaymentsListFilters-warningsSelect"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.WARNING')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {Utils.enumToArray(warningValues).map(value => (
                      <option key={value} value={value}>
                        {I18n.t(warningLabels[value])}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="firstTimeDeposit"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-firstTimeDepositSelect"
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
                    data-testid="PaymentsListFilters-amountRangeGroup"
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
                      data-testid="PaymentsListFilters-amountFromInput"
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
                      data-testid="PaymentsListFilters-amountToInput"
                      withFocus
                    />
                  </RangeGroup>

                  <Field
                    name="currency"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-currencySelect"
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

                  <div className="PaymentsListFilters__buttons">
                    <FilterSetsButtons data-testid="PaymentsListFilters-filterSetsButtons" />

                    <div className="PaymentsListFilters__buttons-group">
                      <RefreshButton
                        onClick={onRefetch}
                        className="PaymentsListFilters__button"
                        data-testid="PaymentsListFilters-refreshButton"
                      />

                      <Button
                        onClick={handleReset}
                        className="PaymentsListFilters__button"
                        data-testid="PaymentsListFilters-resetButton"
                        disabled={paymentsLoading || isSubmitting || !checkIsDirty(values)}
                        primary
                      >
                        {I18n.t('COMMON.RESET')}
                      </Button>

                      <Button
                        type="submit"
                        className="PaymentsListFilters__button"
                        data-testid="PaymentsListFilters-applyButton"
                        disabled={paymentsLoading || isSubmitting || !dirty}
                        primary
                      >
                        {I18n.t('COMMON.APPLY')}
                      </Button>
                    </div>
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
