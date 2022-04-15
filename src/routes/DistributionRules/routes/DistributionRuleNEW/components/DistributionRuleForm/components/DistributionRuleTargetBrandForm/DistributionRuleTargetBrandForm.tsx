import React from 'react';
import { Field, FormikProps } from 'formik';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Desk__Types__Enum as DeskTypesEnum } from '__generated__/types';
import { salesStatuses } from 'constants/salesStatuses';
import {
  FormikSelectField,
  FormikInputField,
} from 'components/Formik';
import { FormikCheckbox } from 'components/Formik';
import { baseUnits } from '../../constants';
import { FormValues } from '../../types';
import { useBrandsQuery } from './graphql/__generated__/BrandsQuery';
import { usePartnersQuery } from './graphql/__generated__/PartnersQuery';
import { useOperatorsByBrandQuery } from './graphql/__generated__/OperatorsByBrandQuery';
import { useClientsAmountQuery } from './graphql/__generated__/ClientsAmountQuery';
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
    },
  } = props;

  // If target source form enabled to edit
  const isEditEnabled = !!sourceBrandConfig?.brand
    && !!sourceBrandConfig?.salesStatuses?.length
    && !!sourceBrandConfig?.countries?.length
    && !!sourceBrandConfig?.languages?.length;

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
      executionPeriodInHours: sourceBrandConfig?.executionPeriodInHours || null,
      firstTimeDeposit: sourceBrandConfig?.firstTimeDeposit || null,
      desks: sourceBrandConfig?.desks || null,
      teams: sourceBrandConfig?.teams || null,
    },
    // Skip query if fetching amount of clients isn't available
    skip: !isClientsAmountAvailable,
  });

  const brands = (brandsQuery.data?.brands || []).filter(({ brandId }) => brandId !== sourceBrandConfig?.brand);
  const partners = (partnersQuery.data?.cdePartners || []).filter(({ brand }) => targetBrandConfig?.brand === brand);
  const operators = operatorsByBrandQuery.data?.operatorsByBrand || [];
  const clientsAmount = clientsAmountQuery.data?.distributionRuleClientsAmount || 0;

  // Calculating right amount of clients for migration
  let totalTargetClientsAmount = Math.min(sourceBrandConfig?.distributionUnit?.quantity as number, clientsAmount);

  if (sourceBrandConfig?.distributionUnit?.baseUnit === 'PERCENTAGE' && sourceBrandConfig?.distributionUnit?.quantity) {
    totalTargetClientsAmount = Math.floor(clientsAmount / 100 * sourceBrandConfig.distributionUnit.quantity);
  }

  return (
    <div className={
      classNames('DistributionRuleTargetBrandForm', {
        'DistributionRuleTargetBrandForm--disabled': !isEditEnabled,
      })}
    >
      <div>
        <Field
          name="targetBrandConfig.brand"
          label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.SOURCE_BRAND')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_BRAND')}
          component={FormikSelectField}
          disabled={brandsQuery.loading || !isEditEnabled}
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
        disabled={!isEditEnabled}
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
          ...Object.keys(salesStatuses).map(key => (
            <option key={key} value={key}>{I18n.t(salesStatuses[key])}</option>
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
        {partners.map(({ uuid, fullName }) => (
          <option key={uuid} value={uuid}>
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
        {operators.map(({ uuid, fullName }) => (
          <option key={uuid} value={uuid}>{fullName}</option>
        ))}
      </Field>

      <Field
        name="targetBrandConfig.copyAffiliateSource"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.COPY_SOURCE')}
        component={FormikCheckbox}
        className="DistributionRuleTargetBrandForm__field-checkbox"
        disabled={!isEditEnabled}
      />

      <div className="DistributionRuleTargetBrandForm__row DistributionRuleTargetBrandForm__row--small">
        <Field
          name="targetBrandConfig.distributionUnit.quantity"
          type="number"
          label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AMOUNT_MIGRATED_CLIENTS')}
          step="1"
          addition={I18n.t(baseUnits[sourceBrandConfig?.distributionUnit?.baseUnit as string])}
          additionPosition="right"
          component={FormikInputField}
          disabled={!isEditEnabled || !sourceBrandConfig?.distributionUnit?.quantity}
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
