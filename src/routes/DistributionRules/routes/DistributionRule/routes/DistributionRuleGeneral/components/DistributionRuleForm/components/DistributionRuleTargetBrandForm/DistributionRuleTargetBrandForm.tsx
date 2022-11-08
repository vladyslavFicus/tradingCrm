import React from 'react';
import { Field, FormikProps, getIn } from 'formik';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { sortBy } from 'lodash';
import { Desk__Types__Enum as DeskTypesEnum } from '__generated__/types';
import { salesStatuses as staticSalesStatuses } from 'constants/salesStatuses';
import {
  FormikSelectField,
  FormikInputField,
  FormikCheckbox,
} from 'components/Formik';
import { baseUnits, MAX_MIGRATED_CLIENTS } from '../../constants';
import { FormValues } from '../../types';
import { useBrandsQuery } from './graphql/__generated__/BrandsQuery';
import { usePartnersQuery } from './graphql/__generated__/PartnersQuery';
import { useOperatorsByBrandQuery } from './graphql/__generated__/OperatorsByBrandQuery';
import { useClientsAmountQuery } from './graphql/__generated__/ClientsAmountQuery';
import { useAcquisitionStatusesQuery } from './graphql/__generated__/AcquisitionStatusesQuery';
import './DistributionRuleTargetBrandForm.scss';

type Props = {
  formik: FormikProps<FormValues>,
}

const DistributionRuleTargetBrandForm = (props: Props) => {
  const {
    formik: {
      values: {
        sourceBrandConfig,
        targetBrandConfig,
      },
      errors,
      setFieldValue,
    },
  } = props;

  // If target source form enabled to edit
  const isEditEnabled = !!sourceBrandConfig?.brand
    && !!sourceBrandConfig?.salesStatuses?.length
    && !!sourceBrandConfig?.countries?.length
    && !!sourceBrandConfig?.languages?.length
    && !getIn(errors, 'sourceBrandConfig');


  // We should fetching and showing clients count only in case when filled all mandatory fields
  const isClientsAmountAvailable = isEditEnabled && !!targetBrandConfig?.brand;

  // Get list of brands
  const brandsQuery = useBrandsQuery();

  // Get all cde partners
  const partnersQuery = usePartnersQuery();

  // Get operators by brand depends on chosen brand
  const operatorsByBrandQuery = useOperatorsByBrandQuery({
    variables: {
      brandId: targetBrandConfig?.brand as string,
      hierarchyTypeGroup: DeskTypesEnum.SALES,
    },
    // Skip query if brand wasn't chosen
    skip: !targetBrandConfig?.brand,
  });

  // Get clients amount depends on chosen fields
  const clientsAmountQuery = useClientsAmountQuery({
    variables: {
      sourceBrand: sourceBrandConfig?.brand as string,
      targetBrand: targetBrandConfig?.brand as string,
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
      brandId: targetBrandConfig?.brand as string,
    },
    // Skip query if brand wasn't chosen
    skip: !targetBrandConfig?.brand,
  });

  const brands = (brandsQuery.data?.brands || []).filter(({ brandId }) => brandId !== sourceBrandConfig?.brand);

  const partners = (partnersQuery.data?.cdePartners || [])
    .filter(({ brand }) => targetBrandConfig?.brand === brand);

  const operators = operatorsByBrandQuery.data?.operatorsByBrand || [];

  const clientsAmount = clientsAmountQuery.data?.distributionRuleClientsAmount || 0;

  const salesStatuses = sortBy(acquisitionStatusesQuery.data?.settings.acquisitionStatuses || [], 'status');

  // Calculating right amount of clients for migration
  let totalTargetClientsAmount = Math.min(sourceBrandConfig?.distributionUnit?.quantity as number, clientsAmount);

  if (sourceBrandConfig?.distributionUnit?.baseUnit === 'PERCENTAGE' && sourceBrandConfig?.distributionUnit?.quantity) {
    totalTargetClientsAmount = Math.floor(clientsAmount / 100 * sourceBrandConfig.distributionUnit.quantity);
  }

  // Quantity field validation
  const validateQuantity = (value: number) => {
    const limitAmount = Math.min(totalTargetClientsAmount, MAX_MIGRATED_CLIENTS);
    const limitAmountPercentage = Math.min(100, Math.floor(MAX_MIGRATED_CLIENTS / totalTargetClientsAmount * 100));

    if (targetBrandConfig.distributionUnit.baseUnit === 'AMOUNT' && value > limitAmount) {
      return I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AVAILABLE_CLIENTS_BY_PERCENTAGE', {
        amount: limitAmount,
        percentage: limitAmountPercentage,
      });
    }

    if (targetBrandConfig.distributionUnit.baseUnit === 'PERCENTAGE' && value > limitAmountPercentage) {
      return I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AVAILABLE_CLIENTS_BY_PERCENTAGE', {
        amount: limitAmount,
        percentage: limitAmountPercentage,
      });
    }

    return null;
  };

  const onChangeBrand = (value: string) => {
    setFieldValue('targetBrandConfig.brand', value);
    setFieldValue('targetBrandConfig.affiliateUuid', '');
  };

  return (
    <div className={
      classNames('DistributionRuleTargetBrandForm', {
        'DistributionRuleTargetBrandForm--disabled': !isEditEnabled,
      })}
    >
      <div>
        <Field
          name="targetBrandConfig.brand"
          label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.TARGET_BRAND')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_BRAND')}
          component={FormikSelectField}
          disabled={brandsQuery.loading || !isEditEnabled}
          searchable
          customOnChange={onChangeBrand}
        >
          {brands.map(brand => (
            <option key={brand.brandId} value={brand.brandId}>
              {brand.brandName}
            </option>
          ))}
        </Field>
        <If condition={isClientsAmountAvailable && !clientsAmountQuery.error}>
          <div
            className="DistributionRuleTargetBrandForm__message"
            dangerouslySetInnerHTML={{
              __html: I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AVAILABLE_CLIENTS_AMOUNT', {
                value: !clientsAmountQuery.loading
                  ? totalTargetClientsAmount
                  : '<span class="DistributionRuleTargetBrandForm__message-spinner">...</span>',
              }),
            }}
          />
        </If>
      </div>

      <Field
        name="targetBrandConfig.targetSalesStatus"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.MIGRATION_STATUS')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        component={FormikSelectField}
        disabled={!isEditEnabled || acquisitionStatusesQuery.loading || salesStatuses.length === 0}
        searchable
      >
        {[
          <option
            key="__CURRENT__"
            value="__CURRENT__"
            className="DistributionRuleTargetBrandForm__field--highlight"
          >
            {I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.MIGRATION_STATUS_CURRENT')}
          </option>,
          ...salesStatuses.map(({ status }) => (
            <option key={status} value={status}>{I18n.t(staticSalesStatuses[status])}</option>
          )),
        ]}
      </Field>

      <Field
        name="targetBrandConfig.affiliateUuid"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.AFFILIATE')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        component={FormikSelectField}
        disabled={partnersQuery.loading || !partners.length || !isEditEnabled}
        searchable
      >
        {partners.map(({ uuid, fullName, status }) => (
          <option
            key={uuid}
            value={uuid}
            disabled={['INACTIVE', 'CLOSED'].includes(status)}
          >
            {fullName}
          </option>
        ))}
      </Field>

      <Field
        name="targetBrandConfig.operator"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.OPERATOR')}
        placeholder={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AUTO_OPERATOR')}
        component={FormikSelectField}
        disabled={operatorsByBrandQuery.loading || !operators.length || !isEditEnabled}
        searchable
      >
        {[
          <option
            key="__CURRENT__"
            // @ts-ignore Because in .tsx files value can't be as option value
            value={null}
            className="DistributionRuleTargetBrandForm__field--highlight"
          >
            {I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AUTO_OPERATOR')}
          </option>,
          ...operators.map(({ uuid, fullName }) => (
            <option key={uuid} value={uuid}>{fullName}</option>
          )),
        ]}
      </Field>

      <Field
        name="targetBrandConfig.copyAffiliateSource"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.COPY_SOURCE')}
        component={FormikCheckbox}
        className="DistributionRuleTargetBrandForm__field-checkbox"
        disabled={!isEditEnabled || !targetBrandConfig.brand}
      />

      <div className="DistributionRuleTargetBrandForm__row DistributionRuleTargetBrandForm__row--small">
        <Field
          name="targetBrandConfig.distributionUnit.quantity"
          type="number"
          label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AMOUNT_MIGRATED_CLIENTS')}
          step="1"
          addition={I18n.t(baseUnits[targetBrandConfig?.distributionUnit?.baseUnit as string])}
          additionPosition="right"
          component={FormikInputField}
          disabled={!isEditEnabled || !sourceBrandConfig?.distributionUnit?.quantity || !targetBrandConfig.brand}
          validate={validateQuantity}
        />
        <If
          condition={
            sourceBrandConfig?.distributionUnit?.baseUnit === 'PERCENTAGE'
            && !!targetBrandConfig?.distributionUnit?.quantity
            && targetBrandConfig.distributionUnit.quantity <= 100
            && !!totalTargetClientsAmount
          }
        >
          <div className="DistributionRuleTargetBrandForm__absolute-clients-count">
            {I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.ABSOLUTE_CLIENTS_COUNT', {
              // @ts-ignore here because TS not working with JSX control statements
              value: Math.floor(totalTargetClientsAmount / 100 * targetBrandConfig.distributionUnit.quantity),
            })}
          </div>
        </If>
      </div>
    </div>
  );
};

export default React.memo(DistributionRuleTargetBrandForm);
