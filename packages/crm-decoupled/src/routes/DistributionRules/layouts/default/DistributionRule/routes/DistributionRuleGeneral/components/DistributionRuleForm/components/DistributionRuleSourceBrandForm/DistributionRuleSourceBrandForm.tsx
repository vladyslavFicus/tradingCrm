import React from 'react';
import { Field, FormikProps } from 'formik';
import I18n from 'i18n-js';
import classNames from 'classnames';
import moment from 'moment';
import { Config, Utils, Constants } from '@crm/common';
import {
  FormikMultipleSelectField,
  FormikSingleSelectField,
  FormikInputField,
  FormikDateRangePicker,
} from 'components';
import { FormValues } from 'routes/DistributionRules/types';
import useDistributionRuleSourceBrandForm
  from 'routes/DistributionRules/hooks/useDistributionRuleSourceBrandForm';
import { baseUnits, periodInDays, periodInHours, sortTypes } from '../../constants';
import './DistributionRuleSourceBrandForm.scss';

type Props = {
  formik: FormikProps<FormValues>,
};

const additionalPeriodInDays = [
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.3_DAYS_AGO',
    value: {
      from: moment().subtract(3, 'days').startOf('days'),
      to: moment().subtract(3, 'days').endOf('days'),
    },
  },
];

const DistributionRuleSourceBrandForm = (props: Props) => {
  const {
    formik: {
      setFieldValue,
      values: {
        executionType,
        sourceBrandConfig,
      },
    },
  } = props;

  const {
    isClientsAmountAvailable,
    acquisitionStatusesLoading,
    brandsLoading,
    brands,
    partnersLoading,
    partners,
    hierarchyBranchesLoading,
    desks,
    clientsAmount,
    clientsAmountData,
    clientsAmountLoading,
    clientsAmountError,
    salesStatuses,
    filteredTeams,
    validateQuantity,
  } = useDistributionRuleSourceBrandForm(sourceBrandConfig);

  return (
    <div className="DistributionRuleSourceBrandForm">
      <div>
        <Field
          searchable
          name="sourceBrandConfig.brand"
          data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigBrandSelect"
          label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.SOURCE_BRAND')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_BRAND')}
          component={FormikSingleSelectField}
          disabled={brandsLoading}
          options={brands.map(brand => ({
            label: brand.brandName,
            value: brand.brandId,
          }))}
        />

        <If condition={isClientsAmountAvailable && !clientsAmountError}>
          <div
            className="DistributionRuleSourceBrandForm__message"
            dangerouslySetInnerHTML={{
              __html: I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AVAILABLE_CLIENTS_AMOUNT', {
                value: !clientsAmountLoading
                  ? clientsAmount
                  : '<span class="DistributionRuleSourceBrandForm__message-spinner">...</span>',
              }),
            }}
          />
        </If>
      </div>

      <div />

      <Field
        multipleLabel
        searchable
        name="sourceBrandConfig.salesStatuses"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigSalesStatusesSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.SALES_STATUS')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
        component={FormikMultipleSelectField}
        disabled={acquisitionStatusesLoading || !salesStatuses.length}
        options={salesStatuses.map(({ status }) => ({
          label: I18n.t(Constants.salesStatuses[status]),
          value: status,
        }))}
      />

      <Field
        withAnyOption
        name="sourceBrandConfig.timeInCurrentStatusInHours"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigTimeInCurrentStatusInHoursSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.EXECUTION_TIME')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikSingleSelectField}
        disabled={!sourceBrandConfig?.brand}
        options={Constants.timeInCurrentStatusInHours.map(({ label, value, i18nValue }) => ({
          label: I18n.t(label, { value: i18nValue }),
          value,
        }))}
      />

      <Field
        multipleLabel
        searchable
        name="sourceBrandConfig.countries"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigCountriesSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.COUNTRY')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
        component={FormikMultipleSelectField}
        disabled={!sourceBrandConfig?.brand}
        options={[
          { label: I18n.t('COMMON.OTHER'), value: 'UNDEFINED' },
          ...Object.keys(Utils.countryList).map(country => ({
            label: Utils.countryList[country],
            value: country,
          })),
        ]}
      />

      <Field
        multipleLabel
        searchable
        name="sourceBrandConfig.languages"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigLanguagesSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.LANGUAGE')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
        component={FormikMultipleSelectField}
        disabled={!sourceBrandConfig?.brand}
        options={[
          { label: I18n.t('COMMON.OTHER'), value: 'UNDEFINED' },
          ...Config.getAvailableLanguages().map((locale: string) => ({
            label: I18n.t(
              `COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`,
              { defaultValue: locale.toUpperCase() },
            ),
            value: locale,
          })),
        ]}
      />

      <Field
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigRegistrationDateRangePicker"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.REGISTRATION_DATE_RANGE')}
        component={FormikDateRangePicker}
        className="DistributionRuleSourceBrandForm__row DistributionRuleSourceBrandForm__row--large"
        fieldsNames={{
          from: 'sourceBrandConfig.registrationDateRange.from',
          to: 'sourceBrandConfig.registrationDateRange.to',
          additional: 'sourceBrandConfig.registrationPeriodInHours',
        }}
        additionalValues={periodInHours}
        additionalOptions={[...additionalPeriodInDays, ...periodInDays]}
        disabled={!sourceBrandConfig?.brand}
        withAdditionalValues
      />

      <Field
        data-testid="DistributionRuleSourceBrandForm-sourceBrandLastNoteDateRangePicker"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.LAST_NOTE_DATE_RANGE')}
        component={FormikDateRangePicker}
        className="DistributionRuleSourceBrandForm__row DistributionRuleSourceBrandForm__row--large"
        fieldsNames={{
          from: 'sourceBrandConfig.lastNoteDateRange.from',
          to: 'sourceBrandConfig.lastNoteDateRange.to',
          additional: 'sourceBrandConfig.lastNotePeriodInHours',
        }}
        additionalValues={periodInHours}
        additionalOptions={periodInDays}
        disabled={!sourceBrandConfig?.brand}
        withAdditionalValues
      />

      <Field
        withAnyOption
        name="sourceBrandConfig.firstTimeDeposit"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigFirstTimeDepositSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.FIRST_TIME_DEPOSIT')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikSingleSelectField}
        disabled={!sourceBrandConfig?.brand}
        options={[
          { label: I18n.t('COMMON.NO'), value: false },
          { label: I18n.t('COMMON.YES'), value: true },
        ]}
      />

      <Field
        searchable
        name="sourceBrandConfig.affiliateUuids"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigAffiliateUuidsSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.AFFILIATE')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikMultipleSelectField}
        disabled={partnersLoading || !sourceBrandConfig?.brand}
        options={partners.map(({ uuid, fullName, status }) => ({
          label: fullName,
          value: uuid,
          className: classNames({
            'DistributionRuleSourceBrandForm__option--inactive': ['INACTIVE', 'CLOSED'].includes(status),
          }),
        }))}
      />

      <Field
        searchable
        name="sourceBrandConfig.desks"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigDesksSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.DESKS')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikMultipleSelectField}
        disabled={hierarchyBranchesLoading || !desks.length}
        options={desks.map(({ uuid, name }) => ({
          label: name,
          value: uuid,
        }))}
      />

      <Field
        searchable
        name="sourceBrandConfig.teams"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigTeamsSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.TEAMS')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikMultipleSelectField}
        disabled={hierarchyBranchesLoading || !filteredTeams.length}
        options={filteredTeams.map(({ uuid, name }) => ({
          label: name,
          value: uuid,
        }))}
      />

      <div className="DistributionRuleSourceBrandForm__row DistributionRuleSourceBrandForm__row--small">
        <Field
          name="sourceBrandConfig.distributionUnit.quantity"
          data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigDistributionUnitQuantityInput"
          type="number"
          label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AMOUNT_MIGRATED_CLIENTS')}
          step="1"
          component={FormikInputField}
          validate={validateQuantity}
          disabled={!clientsAmountData}
        />

        <Field
          name="sourceBrandConfig.distributionUnit.baseUnit"
          data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigDistributionUnitBaseUnitSelect"
          label="&nbsp;"
          component={FormikSingleSelectField}
          disabled={!clientsAmountData}
          onChange={(value: string) => {
            setFieldValue('sourceBrandConfig.distributionUnit.baseUnit', value);
            setFieldValue('targetBrandConfig.distributionUnit.baseUnit', value);
          }}
          options={(executionType === 'MANUAL' ? ['AMOUNT', 'PERCENTAGE'] : ['PERCENTAGE']).map(value => ({
            label: I18n.t(baseUnits[value]),
            value,
          }))}
        />

        <If
          condition={
            sourceBrandConfig?.distributionUnit?.baseUnit === 'PERCENTAGE'
            && !!sourceBrandConfig?.distributionUnit?.quantity
            && sourceBrandConfig.distributionUnit.quantity <= 100
            && !!clientsAmount
          }
        >
          <div className="DistributionRuleSourceBrandForm__absolute-clients-count">
            {I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.ABSOLUTE_CLIENTS_COUNT', {
              // @ts-ignore here because TS not working with JSX control statements
              value: Math.floor(clientsAmount / 100 * sourceBrandConfig.distributionUnit.quantity),
            })}
          </div>
        </If>
      </div>

      <Field
        name="sourceBrandConfig.sortType"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigSortTypeSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.SORT_METHOD')}
        component={FormikSingleSelectField}
        disabled={!sourceBrandConfig?.brand}
        options={Object.keys(sortTypes).map(key => ({
          label: I18n.t(sortTypes[key]),
          value: key,
        }))}
      />
    </div>
  );
};

export default React.memo(DistributionRuleSourceBrandForm);
