import React from 'react';
import { Field, FormikProps } from 'formik';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { salesStatuses as staticSalesStatuses } from 'constants/salesStatuses';
import {
  FormikSelectField,
  FormikInputField,
  FormikCheckbox,
} from 'components/Formik';
import { FormValues } from 'routes/DistributionRules/types';
import useDistributionRuleTargetBrand from 'routes/DistributionRules/hooks/useDistributionRuleTargetBrandForm';
import { baseUnits } from '../../constants';
import './DistributionRuleTargetBrandForm.scss';

type Props = {
  formik: FormikProps<FormValues>,
};

const DistributionRuleTargetBrandForm = (props: Props) => {
  const {
    formik: {
      values: {
        sourceBrandConfig,
        targetBrandConfig,
      },
    },
  } = props;

  const {
    isClientsAmountAvailable,
    isEditEnabled,
    brandsLoading,
    clientsAmountLoading,
    clientsAmountError,
    acquisitionStatusesLoading,
    partnersLoading,
    operatorsByBrandLoading,
    totalTargetClientsAmount,
    brands,
    partners,
    operators,
    salesStatuses,
    validateQuantity,
    onChangeBrand,
  } = useDistributionRuleTargetBrand(props as Props);

  return (
    <div className={
      classNames('DistributionRuleTargetBrandForm', {
        'DistributionRuleTargetBrandForm--disabled': !isEditEnabled,
      })}
    >
      <div>
        <Field
          name="targetBrandConfig.brand"
          data-testid="DistributionRuleTargetBrandForm-targetBrandConfigBrandSelect"
          label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.TARGET_BRAND')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_BRAND')}
          component={FormikSelectField}
          disabled={brandsLoading || !isEditEnabled}
          searchable
          customOnChange={onChangeBrand}
        >
          {brands.map(brand => (
            <option key={brand.brandId} value={brand.brandId}>
              {brand.brandName}
            </option>
          ))}
        </Field>

        <If condition={isClientsAmountAvailable && !clientsAmountError}>
          <div
            className="DistributionRuleTargetBrandForm__message"
            dangerouslySetInnerHTML={{
              __html: I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AVAILABLE_CLIENTS_AMOUNT', {
                value: !clientsAmountLoading
                  ? totalTargetClientsAmount
                  : '<span class="DistributionRuleTargetBrandForm__message-spinner">...</span>',
              }),
            }}
          />
        </If>
      </div>

      <Field
        name="targetBrandConfig.targetSalesStatus"
        data-testid="DistributionRuleTargetBrandForm-targetBrandConfigTargetSalesStatusSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.MIGRATION_STATUS')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        component={FormikSelectField}
        disabled={!isEditEnabled || acquisitionStatusesLoading || salesStatuses.length === 0}
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
        data-testid="DistributionRuleTargetBrandForm-targetBrandConfigAffiliateUuidSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.AFFILIATE_TARGET_BRAND')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        component={FormikSelectField}
        disabled={partnersLoading || !partners.length || !isEditEnabled}
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
        data-testid="DistributionRuleTargetBrandForm-targetBrandConfigOperatorSelect"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.OPERATOR')}
        placeholder={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AUTO_OPERATOR')}
        component={FormikSelectField}
        disabled={operatorsByBrandLoading || !operators.length || !isEditEnabled}
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
        data-testid="DistributionRuleTargetBrandForm-targetBrandConfigCopyAffiliateSourceCheckbox"
        label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.COPY_SOURCE')}
        component={FormikCheckbox}
        className="DistributionRuleTargetBrandForm__field-checkbox"
        disabled={!isEditEnabled || !targetBrandConfig.brand}
      />

      <div className="DistributionRuleTargetBrandForm__row DistributionRuleTargetBrandForm__row--small">
        <Field
          name="targetBrandConfig.distributionUnit.quantity"
          type="number"
          data-testid="DistributionRuleTargetBrandForm-targetBrandConfigDistributionUnitQuantityInput"
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
