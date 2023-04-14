import React from 'react';
import { Field, FormikProps } from 'formik';
import I18n from 'i18n-js';
import classNames from 'classnames';
import moment from 'moment';
import { sortBy } from 'lodash';
import { getAvailableLanguages } from 'config';
import { salesStatuses as staticSalesStatuses } from 'constants/salesStatuses';
import { timeInCurrentStatusInHours } from 'constants/clientsDistribution';
import {
  FormikSelectField,
  FormikInputField,
  FormikDateRangePicker,
} from 'components/Formik';
import countryList from 'utils/countryList';
import { baseUnits, periodInDays, periodInHours, sortTypes } from '../../constants';
import { FormValues } from '../../types';
import { useBrandsQuery } from './graphql/__generated__/BrandsQuery';
import { useHierarchyBranchesQuery } from './graphql/__generated__/HierarchyBranchesQuery';
import { usePartnersQuery } from './graphql/__generated__/PartnersQuery';
import { useClientsAmountQuery } from './graphql/__generated__/ClientsAmountQuery';
import { useAcquisitionStatusesQuery } from './graphql/__generated__/AcquisitionStatusesQuery';
import './DistributionRuleSourceBrandForm.scss';

type Props = {
  formik: FormikProps<FormValues>,
}

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

  // We should fetching and showing clients count only in case when filled all mandatory fields
  const isClientsAmountAvailable = !!sourceBrandConfig?.brand
    && !!sourceBrandConfig?.salesStatuses?.length
    && !!sourceBrandConfig?.countries?.length
    && !!sourceBrandConfig?.languages?.length;

  // Get list of brands
  const brandsQuery = useBrandsQuery();

  // Get partners depends on chosen brand
  const partnersQuery = usePartnersQuery({
    variables: {
      brandId: sourceBrandConfig?.brand as string,
      page: {
        from: 0,
        size: 10000,
        sorts: [
          { column: 'status', direction: 'ASC' },
          { column: 'firstName', direction: 'ASC' },
          { column: 'lastName', direction: 'ASC' },
        ],
      },
    },
    // Skip query if brand wasn't chosen
    skip: !sourceBrandConfig?.brand,
  });

  // Get hierarchy branches depends on chosen brand
  const hierarchyBranchesQuery = useHierarchyBranchesQuery({
    variables: {
      brandId: sourceBrandConfig?.brand as string,
    },
    // Skip query if brand wasn't chosen
    skip: !sourceBrandConfig?.brand,
  });

  // Get clients amount depends on chosen fields
  const clientsAmountQuery = useClientsAmountQuery({
    variables: {
      sourceBrand: sourceBrandConfig?.brand as string,
      salesStatuses: sourceBrandConfig?.salesStatuses || null,
      countries: sourceBrandConfig?.countries || null,
      languages: sourceBrandConfig?.languages || null,
      affiliateUuids: sourceBrandConfig?.affiliateUuids || null,
      registrationPeriodInHours: sourceBrandConfig?.registrationPeriodInHours || null,
      registrationDateRange: sourceBrandConfig?.registrationDateRange || null,
      lastNotePeriodInHours: sourceBrandConfig?.lastNotePeriodInHours || null,
      lastNoteDateRange: sourceBrandConfig?.lastNoteDateRange || null,
      timeInCurrentStatusInHours: sourceBrandConfig?.timeInCurrentStatusInHours || null,
      firstTimeDeposit: sourceBrandConfig?.firstTimeDeposit || null,
      desks: sourceBrandConfig?.desks || null,
      teams: sourceBrandConfig?.teams || null,
    },
    // Skip query if fetching amount of clients isn't available
    skip: !isClientsAmountAvailable,
  });

  // Get sales statuses
  const acquisitionStatusesQuery = useAcquisitionStatusesQuery({
    variables: {
      brandId: sourceBrandConfig?.brand as string,
    },
    // Skip query if brand wasn't chosen
    skip: !sourceBrandConfig?.brand,
  });

  const brands = brandsQuery.data?.brands || [];
  const partners = partnersQuery.data?.partners.content || [];
  const desks = hierarchyBranchesQuery.data?.userBranches?.DESK || [];
  const teams = hierarchyBranchesQuery.data?.userBranches?.TEAM || [];
  const clientsAmount = clientsAmountQuery.data?.distributionRuleClientsAmount || 0;
  const salesStatuses = sortBy(acquisitionStatusesQuery.data?.settings.acquisitionStatuses || [], 'status');

  // Filter teams depends on selected desk
  const filteredTeams = sourceBrandConfig?.desks?.length
    ? teams.filter(({ parentBranch }) => parentBranch && sourceBrandConfig?.desks?.includes(parentBranch.uuid))
    : teams;

  // Quantity field validation
  const validateQuantity = (value: number) => {
    if ((sourceBrandConfig.distributionUnit.baseUnit === 'AMOUNT' && value > clientsAmount)
      || (sourceBrandConfig.distributionUnit.baseUnit === 'PERCENTAGE' && value > 100)) {
      return I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.MAX_AVAILABLE_CLIENTS', {
        max: clientsAmount,
      });
    }

    return null;
  };

  return (
    <div className="DistributionRuleSourceBrandForm">
      <div>
        <Field
          name="sourceBrandConfig.brand"
          label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.SOURCE_BRAND')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_BRAND')}
          component={FormikSelectField}
          disabled={brandsQuery.loading}
          searchable
        >
          {brands.map(brand => (
            <option key={brand.brandId} value={brand.brandId}>
              {brand.brandName}
            </option>
          ))}
        </Field>
        <If condition={isClientsAmountAvailable && !clientsAmountQuery.error}>
          <div
            className="DistributionRuleSourceBrandForm__message"
            dangerouslySetInnerHTML={{
              __html: I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AVAILABLE_CLIENTS_AMOUNT', {
                value: !clientsAmountQuery.loading
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
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.SALES_STATUS')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
        component={FormikSelectField}
        disabled={acquisitionStatusesQuery.loading || salesStatuses.length === 0}
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
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.AFFILIATE')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikSelectField}
        disabled={partnersQuery.loading || !sourceBrandConfig?.brand}
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
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.DESKS')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikSelectField}
        disabled={hierarchyBranchesQuery.loading || desks.length === 0}
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
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.TEAMS')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikSelectField}
        disabled={hierarchyBranchesQuery.loading || filteredTeams.length === 0}
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
          type="number"
          label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AMOUNT_MIGRATED_CLIENTS')}
          step="1"
          component={FormikInputField}
          validate={validateQuantity}
          disabled={!clientsAmountQuery.data}
        />
        <Field
          name="sourceBrandConfig.distributionUnit.baseUnit"
          label="&nbsp;"
          component={FormikSelectField}
          disabled={!clientsAmountQuery.data}
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
