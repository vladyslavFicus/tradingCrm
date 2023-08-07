import React from 'react';
import { Field, Form, Formik } from 'formik';
import I18n from 'i18n-js';
import { createValidator } from 'utils/validator';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components';
import { FormValues } from 'routes/DistributionRules/types';
import useDistributionRuleForm from 'routes/DistributionRules/hooks/useDistributionRuleForm';
import { executionTypes } from './constants';
import DistributionRuleSourceBrandForm from './components/DistributionRuleSourceBrandForm';
import DistributionRuleTargetBrandForm from './components/DistributionRuleTargetBrandForm';
import './DistributionRuleForm.scss';

const DistributionRuleForm = () => {
  const {
    distributionRule,
    sourceBrandConfig,
    targetBrandConfig,
    handleSubmit,
    handleCancel,
  } = useDistributionRuleForm();

  return (
    <div className="DistributionRuleForm">
      <Formik
        enableReinitialize
        initialValues={{
          executionType: distributionRule?.executionType || 'MANUAL',
          sourceBrandConfig: {
            brand: sourceBrandConfig?.brand || '',
            affiliateUuids: sourceBrandConfig?.affiliateUuids || [],
            desks: sourceBrandConfig?.desks || [],
            teams: sourceBrandConfig?.teams || [],
            salesStatuses: sourceBrandConfig?.salesStatuses || [],
            timeInCurrentStatusInHours: sourceBrandConfig?.timeInCurrentStatusInHours || null,
            countries: sourceBrandConfig?.countries || [],
            languages: sourceBrandConfig?.languages || [],
            firstTimeDeposit: sourceBrandConfig?.firstTimeDeposit || null,
            sortType: sourceBrandConfig?.sortType || 'FIFO',
            distributionUnit: {
              quantity: sourceBrandConfig?.distributionUnit?.quantity || null,
              baseUnit: sourceBrandConfig?.distributionUnit?.baseUnit || 'PERCENTAGE',
            },
            registrationPeriodInHours: sourceBrandConfig?.registrationPeriodInHours || null,
            registrationDateRange: {
              from: sourceBrandConfig?.registrationDateRange?.from || '',
              to: sourceBrandConfig?.registrationDateRange?.to || '',
            },
            lastNotePeriodInHours: sourceBrandConfig?.lastNotePeriodInHours || null,
            lastNoteDateRange: {
              from: sourceBrandConfig?.lastNoteDateRange?.from || '',
              to: sourceBrandConfig?.lastNoteDateRange?.to || '',
            },
          },
          targetBrandConfig: {
            brand: targetBrandConfig?.brand || '',
            targetSalesStatus: targetBrandConfig?.targetSalesStatus || null,
            affiliateUuid: targetBrandConfig?.affiliateUuid || '',
            operator: targetBrandConfig?.operator || null,
            copyAffiliateSource: targetBrandConfig?.copyAffiliateSource || false,
            distributionUnit: {
              quantity: targetBrandConfig?.distributionUnit?.quantity || null,
              baseUnit: targetBrandConfig?.distributionUnit?.baseUnit || 'PERCENTAGE',
            },
          },
        } as FormValues}
        validate={values => createValidator({
          executionType: ['required'],
          sourceBrandConfig: {
            brand: ['required'],
            salesStatuses: ['required'],
            countries: ['required'],
            registrationDateRange: {
              from: ['dateWithTime', `validDateTimeRange:${values.sourceBrandConfig.registrationDateRange?.to}`],
              to: ['dateWithTime'],
            },
            lastNoteDateRange: {
              from: ['dateWithTime', `validDateTimeRange:${values.sourceBrandConfig.lastNoteDateRange?.to}`],
              to: ['dateWithTime'],
            },
            languages: ['required'],
            distributionUnit: {
              quantity: ['required', 'integer', 'min:1'],
            },
          },
          targetBrandConfig: {
            brand: ['required'],
            targetSalesStatus: ['required'],
            affiliateUuid: ['required'],
            distributionUnit: {
              quantity: ['required', 'integer', 'min:1'],
            },
          },
        }, {
          'sourceBrandConfig.brand': I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.SOURCE_BRAND'),
          'sourceBrandConfig.salesStatuses': I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.SALES_STATUS'),
          'sourceBrandConfig.countries': I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.COUNTRY'),
          'sourceBrandConfig.languages': I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.LANGUAGE'),
          'sourceBrandConfig.distributionUnit.quantity':
            I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AMOUNT_MIGRATED_CLIENTS'),
          'targetBrandConfig.brand': I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.TARGET_BRAND'),
          'targetBrandConfig.targetSalesStatus': I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.MIGRATION_STATUS'),
          'targetBrandConfig.affiliateUuid': I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.AFFILIATE_TARGET_BRAND'),
          'targetBrandConfig.distributionUnit.quantity':
            I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AMOUNT_MIGRATED_CLIENTS'),
        }, false)(values)}
        onSubmit={handleSubmit}
      >
        {formik => (
          <Form>
            <div className="DistributionRuleForm__common">
              <Field
                name="executionType"
                data-testid="DistributionRuleForm-executionTypeSelect"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.EXECUTION_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                className="DistributionRuleForm__form-field"
                component={FormikSelectField}
              >
                {executionTypes.map(({ label, value }) => (
                  <option key={value} value={value}>{I18n.t(label)}</option>
                ))}
              </Field>

              <If condition={formik.dirty}>
                <div className="DistributionRuleForm__not-saved-message">
                  {I18n.t('CLIENTS_DISTRIBUTION.RULE.NOT_SAVED')}
                </div>
              </If>
            </div>

            <div className="DistributionRuleForm__brands">
              <fieldset className="DistributionRuleForm__fieldset">
                <legend className="DistributionRuleForm__fieldset-title">
                  {I18n.t('CLIENTS_DISTRIBUTION.RULE.SOURCE_BRAND')}
                </legend>

                <DistributionRuleSourceBrandForm formik={formik} />
              </fieldset>

              <fieldset className="DistributionRuleForm__fieldset">
                <legend className="DistributionRuleForm__fieldset-title">
                  {I18n.t('CLIENTS_DISTRIBUTION.RULE.TARGET_BRAND')}
                </legend>

                <DistributionRuleTargetBrandForm formik={formik} />
              </fieldset>
            </div>

            <div className="DistributionRuleForm__actions">
              <Button
                className="DistributionRuleForm__actions-btn"
                data-testid="DistributionRuleForm-cancelButton"
                onClick={handleCancel}
                tertiary
              >
                {I18n.t('COMMON.CANCEL')}
              </Button>

              <Button
                primary
                type="submit"
                className="DistributionRule__actions-btn"
                data-testid="DistributionRuleForm-saveButton"
                disabled={!formik.dirty}
                submitting={formik.isSubmitting}
              >
                {I18n.t('COMMON.SAVE')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(DistributionRuleForm);
