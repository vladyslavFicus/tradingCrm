import React from 'react';
import { Field, Form, Formik } from 'formik';
import { useHistory, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { LevelType, Notify } from 'types';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { executionTypes } from './constants';
import DistributionRuleSourceBrandForm from './components/DistributionRuleSourceBrandForm';
import DistributionRuleTargetBrandForm from './components/DistributionRuleTargetBrandForm';
import { useDistributionRuleQuery } from './graphql/__generated__/DistributionRuleQuery';
import { useUpdateRuleMutation } from './graphql/__generated__/UpdateRuleMutation';
import { FormValues } from './types';
import './DistributionRuleForm.scss';

type Props = {
  notify: Notify,
}

const DistributionRuleForm = (props: Props) => {
  const { notify } = props;

  const history = useHistory();
  const { id: uuid } = useParams<{ id: string }>();

  const distributionRuleQuery = useDistributionRuleQuery({ variables: { uuid } });
  const [updateRule] = useUpdateRuleMutation();

  const distributionRule = distributionRuleQuery.data?.distributionRule;
  const sourceBrandConfig = distributionRule?.sourceBrandConfigs && distributionRule.sourceBrandConfigs[0];
  const targetBrandConfig = distributionRule?.targetBrandConfigs && distributionRule.targetBrandConfigs[0];

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    try {
      await updateRule({
        variables: {
          args: {
            uuid: distributionRule?.uuid as string,
            ...values,
          },
        },
      });

      await distributionRuleQuery.refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.SUCCESS_MESSAGE'),
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
        enableReinitialize
        validateOnChange={false}
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

export default compose(
  React.memo,
  withNotifications,
)(DistributionRuleForm);
