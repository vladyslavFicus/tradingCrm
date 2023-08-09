import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Field, Form, Formik } from 'formik';
import { Utils } from '@crm/common';
import { Button, FormikMultipleSelectField, FormikSingleSelectField, RefreshButton } from 'components';
import { FormikDateRangePicker, FormikInputField } from 'components/Formik';
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
                    withAnyOption
                    withFocus
                    name="paymentAggregator"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-paymentAggregatorSelect"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PAYMENT_AGGREGATOR')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSingleSelectField}
                    options={Utils.enumToArray(aggregators).map(value => ({
                      label: I18n.t(aggregatorsLabels[value]),
                      value,
                    }))}
                  />

                  <Field
                    searchable
                    withFocus
                    name="paymentMethods"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-paymentMethodsSelect"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PAYMENT_METHOD')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    disabled={paymentMethodsLoading}
                    component={FormikMultipleSelectField}
                    options={paymentMethods.map(value => ({
                      label: Utils.formatLabel(value, false),
                      value,
                    }))}
                  />

                  <Field
                    withFocus
                    name="bankName"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-bankNameSelect"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PAYMENT_SYSTEM')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSingleSelectField}
                    withGroup={{ firstTitle: 'COMMON.FAVORITE', secondTitle: 'COMMON.OTHER' }}
                    options={paymentSystemsProvider.map(({ paymentSystem, isFavourite }) => ({
                      label: Utils.formatLabel(paymentSystem, false),
                      value: paymentSystem,
                      isFavourite,
                    }))}
                  />

                  <Field
                    searchable
                    withFocus
                    name="paymentTypes"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-paymentTypesSelect"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.TYPE')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikMultipleSelectField}
                    options={Object.keys(tradingTypes)
                      .filter(value => tradingTypesLabels[value])
                      .map(value => ({
                        label: I18n.t(tradingTypesLabels[value]),
                        value,
                      }))}
                  />

                  <Field
                    searchable
                    withFocus
                    name="statuses"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-statusesSelect"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.STATUSES')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikMultipleSelectField}
                    options={Utils.enumToArray(tradingStatuses).map(value => ({
                      label: I18n.t(tradingStatusesLabels[value]),
                      value,
                    }))}
                  />


                  <If condition={!clientView}>
                    <Field
                      searchable
                      withFocus
                      name="countries"
                      className="PaymentsListFilters__field PaymentsListFilters__select"
                      data-testid="PaymentsListFilters-countriesSelect"
                      label={I18n.t('PROFILE.LIST.FILTERS.COUNTRY')}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                      component={FormikMultipleSelectField}
                      options={[
                        { label: I18n.t('COMMON.OTHER'), value: 'UNDEFINED' },
                        ...Object.keys(Utils.countryList).map(country => ({
                          label: Utils.countryList[country],
                          value: country,
                        })),
                      ]}
                    />

                    <Field
                      searchable
                      withFocus
                      name="affiliateUuids"
                      className="PaymentsListFilters__field PaymentsListFilters__select"
                      data-testid="PaymentsListFilters-affiliateUuidsSelect"
                      label={I18n.t('PROFILE.LIST.FILTERS.AFFILIATES')}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                      component={FormikMultipleSelectField}
                      disabled={partnersLoading || !partners.length}
                      options={[{ uuid: 'NONE', fullName: I18n.t('COMMON.NONE') }, ...partners]
                        .map(({ uuid, fullName }) => ({
                          label: fullName,
                          value: uuid,
                        }))}
                    />
                  </If>

                  <Field
                    searchable
                    withFocus
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
                    component={FormikMultipleSelectField}
                    disabled={desksAndTeamsLoading || desksList.length === 0}
                    options={desksList.map(({ uuid, name }) => ({
                      label: name,
                      value: uuid,
                    }))}
                  />

                  <Field
                    searchable
                    withFocus
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
                    component={FormikMultipleSelectField}
                    disabled={desksAndTeamsLoading || teamsOptions.length === 0}
                    options={teamsOptions.map(({ uuid, name }) => ({
                      label: name,
                      value: uuid,
                    }))}
                  />

                  <Field
                    searchable
                    withFocus
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
                    component={FormikMultipleSelectField}
                    disabled={operatorsLoading || operatorsOptions.length === 0}
                    options={operatorsOptions.map(({ uuid, fullName, operatorStatus }) => ({
                      label: fullName,
                      value: uuid,
                      className: classNames('PaymentsListFilters__select-option', {
                        'PaymentsListFilters__select-option--inactive': operatorStatus !== operatorsStasuses.ACTIVE,
                      }),
                    }))}
                  />

                  <Field
                    withAnyOption
                    withFocus
                    name="accountType"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-accountTypeSelect"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ACCOUNT_TYPE')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSingleSelectField}
                    options={accountTypes.map(({ value, label }) => ({
                      label: I18n.t(label),
                      value,
                    }))}
                  />

                  <If condition={platformTypes.length > 1}>
                    <Field
                      withAnyOption
                      withFocus
                      name="platformType"
                      data-testid="PaymentsListFilters-platformTypeSelect"
                      label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PLATFORM_TYPE')}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                      className="PaymentsListFilters__field PaymentsListFilters__select"
                      component={FormikSingleSelectField}
                      options={platformTypes.map(({ value, label }) => ({
                        label,
                        value,
                      }))}
                    />
                  </If>

                  <Field
                    withAnyOption
                    withFocus
                    name="warnings"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-warningsSelect"
                    label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.WARNING')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSingleSelectField}
                    options={Utils.enumToArray(warningValues).map(value => ({
                      label: I18n.t(warningLabels[value]),
                      value,
                    }))}
                  />

                  <Field
                    withAnyOption
                    withFocus
                    name="firstTimeDeposit"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-firstTimeDepositSelect"
                    label={I18n.t('PROFILE.LIST.FILTERS.FIRST_DEPOSIT')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSingleSelectField}
                    options={firstTimeDepositFilter.map(({ value, label }) => ({
                      label: I18n.t(label),
                      value,
                    }))}
                  />

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
                    withAnyOption
                    withFocus
                    name="currency"
                    className="PaymentsListFilters__field PaymentsListFilters__select"
                    data-testid="PaymentsListFilters-currencySelect"
                    label={I18n.t('COMMON.CURRENCY')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSingleSelectField}
                    options={currencies.map((value: string) => ({
                      label: value,
                      value,
                    }))}
                  />

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
