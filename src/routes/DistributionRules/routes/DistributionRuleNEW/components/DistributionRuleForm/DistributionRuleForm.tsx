import React from 'react';
import { Field, Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { LevelType, Notify } from 'types';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { DistributionRuleType } from '../../DistributionRule';
import { executionTypes } from './constants';
import DistributionRuleSourceBrandForm from './components/DistributionRuleSourceBrandForm';
import DistributionRuleTargetBrandForm from './components/DistributionRuleTargetBrandForm';
import { useUpdateRuleMutation } from './graphql/__generated__/UpdateRuleMutation';
import { FormValues } from './types';
import './DistributionRuleForm.scss';

type Props = {
  notify: Notify,
  distributionRule: DistributionRuleType,
}

const DistributionRuleForm = (props: Props) => {
  const { distributionRule, notify } = props;

  const history = useHistory();

  const [updateRule] = useUpdateRuleMutation();

  const sourceBrandConfig = distributionRule.sourceBrandConfigs && distributionRule.sourceBrandConfigs[0];
  const targetBrandConfig = distributionRule.targetBrandConfigs && distributionRule.targetBrandConfigs[0];

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    try {
      await updateRule({
        variables: {
          args: {
            uuid: distributionRule.uuid,
            executionType: values.executionType,
            salesStatuses: values.sourceBrandConfig.salesStatuses,
            executionPeriodInHours: values.sourceBrandConfig.executionPeriodInHours,
            countries: values.sourceBrandConfig.countries,
            languages: values.sourceBrandConfig.languages,
            firstTimeDeposit: values.sourceBrandConfig.firstTimeDeposit,
            registrationPeriodInHours: values.sourceBrandConfig.registrationPeriodInHours,
            targetSalesStatus: values.targetBrandConfig.targetSalesStatus,
            registrationDateRange: {
              from: values.sourceBrandConfig.registrationDateRange.from,
              to: values.sourceBrandConfig.registrationDateRange.to,
            },
            lastNotePeriodInHours: values.sourceBrandConfig.lastNotePeriodInHours,
            lastNoteDateRange: {
              from: values.sourceBrandConfig.lastNoteDateRange.from,
              to: values.sourceBrandConfig.lastNoteDateRange.to,
            },
            sourceBrandConfig: {
              brand: values.sourceBrandConfig.brand,
              affiliateUuids: values.sourceBrandConfig.affiliateUuids,
              desks: values.sourceBrandConfig.desks,
              teams: values.sourceBrandConfig.teams,
              sortType: values.sourceBrandConfig.sortType,
              distributionUnit: {
                quantity: values.sourceBrandConfig.distributionUnit?.quantity,
                baseUnit: values.sourceBrandConfig.distributionUnit?.baseUnit,
              },
            },
            targetBrandConfig: {
              brand: values.targetBrandConfig.brand,
              affiliateUuid: values.targetBrandConfig.affiliateUuid,
              operator: values.targetBrandConfig.operator,
              copyAffiliateSource: values.targetBrandConfig.copyAffiliateSource,
              distributionUnit: {
                quantity: values.targetBrandConfig.distributionUnit.quantity,
                baseUnit: values.targetBrandConfig.distributionUnit.baseUnit,
              },
            },
          },
        },
      });
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_TITLE'),
        message: error === 'error.entity.already.exist'
          ? I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ALREADY_EXIST')
          : I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_MESSAGE'),
      });
    }
  };

  const handleCancel = () => {
    history.push('/distribution');
  };

  return (
    <div className="DistributionRuleForm">
      <Formik
        initialValues={{
          executionType: distributionRule.executionType || 'MANUAL',
          sourceBrandConfig: {
            brand: sourceBrandConfig?.brand || '',
            affiliateUuids: sourceBrandConfig?.affiliateUuids || [],
            desks: sourceBrandConfig?.desks || [],
            teams: sourceBrandConfig?.teams || [],
            salesStatuses: distributionRule.salesStatuses || [],
            executionPeriodInHours: distributionRule.executionPeriodInHours,
            countries: distributionRule.countries || [],
            languages: distributionRule.languages || [],
            firstTimeDeposit: distributionRule.firstTimeDeposit,
            sortType: sourceBrandConfig?.sortType || 'FIFO',
            distributionUnit: {
              quantity: sourceBrandConfig?.distributionUnit?.quantity || null,
              baseUnit: sourceBrandConfig?.distributionUnit?.baseUnit || 'PERCENTAGE',
            },
            registrationPeriodInHours: distributionRule.registrationPeriodInHours,
            registrationDateRange: {
              from: distributionRule?.registrationDateRange?.from || '',
              to: distributionRule?.registrationDateRange?.to || '',
            },
            lastNotePeriodInHours: distributionRule.lastNotePeriodInHours,
            lastNoteDateRange: {
              from: distributionRule?.lastNoteDateRange?.from || '',
              to: distributionRule?.lastNoteDateRange?.to || '',
            },
          },
          targetBrandConfig: {
            brand: targetBrandConfig?.brand || '',
            targetSalesStatus: distributionRule.targetSalesStatus,
            affiliateUuid: targetBrandConfig?.affiliateUuid || '',
            operator: targetBrandConfig?.operator || '',
            copyAffiliateSource: targetBrandConfig?.copyAffiliateSource || false,
            distributionUnit: {
              quantity: targetBrandConfig?.distributionUnit?.quantity || null,
              baseUnit: targetBrandConfig?.distributionUnit?.baseUnit || 'PERCENTAGE',
            },
          },
        } as FormValues}
        onSubmit={handleSubmit}
      >
        {formik => (
          <Form>
            <div className="DistributionRuleForm__common">
              <Field
                name="executionType"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.EXECUTION_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
              >
                {executionTypes.map(({ label, value }) => (
                  <option key={value} value={value}>{I18n.t(label)}</option>
                ))}
              </Field>
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
                onClick={handleCancel}
                commonOutline
              >
                {I18n.t('COMMON.CANCEL')}
              </Button>
              <Button
                primary
                type="submit"
                className="DistributionRule__actions-btn"
                disabled={!formik.isValid}
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

export default compose(
  React.memo,
  withNotifications,
)(DistributionRuleForm);
