import React from 'react';
import { Field, FormikProps } from 'formik';
import I18n from 'i18n-js';
import classNames from 'classnames';
import moment from 'moment';
import { getAvailableLanguages } from 'config';
import { salesStatuses as staticSalesStatuses } from 'constants/salesStatuses';
import { timeInCurrentStatusInHours } from 'constants/clientsDistribution';
import {
  FormikSelectField,
  FormikInputField,
  FormikDateRangePicker,
} from 'components/Formik';
import countryList from 'utils/countryList';
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
          name="sourceBrandConfig.brand"
          data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigBrandSelect"
          label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.SOURCE_BRAND')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_BRAND')}
          component={FormikSelectField}
          disabled={brandsLoading}
          searchable
        >
          {brands.map(brand => (
            <option key={brand.brandId} value={brand.brandId}>
              {brand.brandName}
            </option>
          ))}
        </Field>

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
        name="sourceBrandConfig.salesStatuses"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigSalesStatusesSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.SALES_STATUS')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
        component={FormikSelectField}
        disabled={acquisitionStatusesLoading || !salesStatuses.length}
        multipleLabel
        searchable
        multiple
      >
        {salesStatuses.map(({ status }) => (
          <option key={status} value={status}>{I18n.t(staticSalesStatuses[status])}</option>
        ))}
      </Field>

      <Field
        name="sourceBrandConfig.timeInCurrentStatusInHours"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigTimeInCurrentStatusInHoursSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.EXECUTION_TIME')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikSelectField}
        disabled={!sourceBrandConfig?.brand}
        withAnyOption
      >
        {timeInCurrentStatusInHours.map(({ label, value, i18nValue }) => (
          <option key={value} value={value}>
            {I18n.t(label, { value: i18nValue })}
          </option>
        ))}
      </Field>

      <Field
        name="sourceBrandConfig.countries"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigCountriesSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.COUNTRY')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
        component={FormikSelectField}
        disabled={!sourceBrandConfig?.brand}
        multipleLabel
        searchable
        multiple
      >
        {[
          <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
          ...Object.keys(countryList).map(key => (
            <option key={key} value={key}>{countryList[key]}</option>
          )),
        ]}
      </Field>

      <Field
        name="sourceBrandConfig.languages"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigLanguagesSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.LANGUAGE')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
        component={FormikSelectField}
        disabled={!sourceBrandConfig?.brand}
        multipleLabel
        searchable
        multiple
      >
        {[
          <option key="undefined" value="undefined">{I18n.t('COMMON.OTHER')}</option>,
          ...getAvailableLanguages().map((locale: string) => (
            <option key={locale} value={locale}>
              {I18n.t(
                `COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`,
                { defaultValue: locale.toUpperCase() },
              )}
            </option>
          )),
        ]}
      </Field>

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
        name="sourceBrandConfig.firstTimeDeposit"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigFirstTimeDepositSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.FIRST_TIME_DEPOSIT')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikSelectField}
        disabled={!sourceBrandConfig?.brand}
        withAnyOption
      >
        {/* @ts-ignore TS doesn't approve value as boolean type */}
        <option key="NO" value={false}>
          {I18n.t('COMMON.NO')}
        </option>

        {/* @ts-ignore TS doesn't approve value as boolean type */}
        <option key="YES" value>
          {I18n.t('COMMON.YES')}
        </option>
      </Field>

      <Field
        name="sourceBrandConfig.affiliateUuids"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigAffiliateUuidsSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.AFFILIATE')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikSelectField}
        disabled={partnersLoading || !sourceBrandConfig?.brand}
        searchable
        multiple
      >
        {partners.map(({ uuid, fullName, status }) => (
          <option
            key={uuid}
            value={uuid}
            className={
              classNames({
                'DistributionRuleSourceBrandForm__option--inactive': ['INACTIVE', 'CLOSED'].includes(status),
              })
            }
          >
            {fullName}
          </option>
        ))}
      </Field>

      <Field
        name="sourceBrandConfig.desks"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigDesksSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.DESKS')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikSelectField}
        disabled={hierarchyBranchesLoading || !desks.length}
        searchable
        multiple
      >
        {desks.map(({ uuid, name }) => (
          <option key={uuid} value={uuid}>
            {name}
          </option>
        ))}
      </Field>

      <Field
        name="sourceBrandConfig.teams"
        data-testid="DistributionRuleSourceBrandForm-sourceBrandConfigTeamsSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.TEAMS')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikSelectField}
        disabled={hierarchyBranchesLoading || !filteredTeams.length}
        searchable
        multiple
      >
        {filteredTeams.map(({ uuid, name }) => (
          <option key={uuid} value={uuid}>
            {name}
          </option>
        ))}
      </Field>

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
          component={FormikSelectField}
          disabled={!clientsAmountData}
          customOnChange={(value: string) => {
            setFieldValue('sourceBrandConfig.distributionUnit.baseUnit', value);
            setFieldValue('targetBrandConfig.distributionUnit.baseUnit', value);
          }}
        >
          {(executionType === 'MANUAL' ? ['AMOUNT', 'PERCENTAGE'] : ['PERCENTAGE']).map(value => (
            <option key={value} value={value}>{I18n.t(baseUnits[value])}</option>
          ))}
        </Field>

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
        component={FormikSelectField}
        disabled={!sourceBrandConfig?.brand}
      >
        {Object.keys(sortTypes).map(key => (
          <option key={key} value={key}>{I18n.t(sortTypes[key])}</option>
        ))}
      </Field>
    </div>
  );
};

export default React.memo(DistributionRuleSourceBrandForm);
