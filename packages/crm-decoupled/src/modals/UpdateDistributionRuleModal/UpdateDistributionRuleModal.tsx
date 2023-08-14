import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { Utils, parseErrors, notify, Types } from '@crm/common';
import { FormikInputField } from 'components/Formik';
import Modal from 'components/Modal';
import { useDistributionRuleQuery } from './graphql/__generated__/DistributionRuleQuery';
import { useUpdateDistributionRuleMutation } from './graphql/__generated__/UpdateDistributionRuleMutation';
import './UpdateDistributionRuleModal.scss';

export type FormValues = {
  ruleName: string,
  ruleOrder: number,
};

export type Props = {
  uuid: string,
  onCloseModal: () => void,
};

const UpdateDistributionRuleModal = (props: Props) => {
  const { uuid, onCloseModal } = props;

  const [formError, setFormError] = useState<string | null>(null);

  // ===== Requests ===== //
  const distributionRuleQuery = useDistributionRuleQuery({ variables: { uuid } });

  const distributionRule = distributionRuleQuery.data?.distributionRule;

  const [updateDistributionRule] = useUpdateDistributionRuleMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    setFormError(null);

    try {
      await updateDistributionRule({
        variables: {
          uuid,
          ruleName: values.ruleName,
          ruleOrder: values.ruleOrder,
        },
      });

      onCloseModal();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS_DISTRIBUTION.UPDATE_RULE_SUCCESS', { ruleName: values.ruleName }),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.entity.already.exist') {
        setFormError(I18n.t('CLIENTS_DISTRIBUTION.CREATE_RULE_EXIST', { ruleName: error?.errorParameters?.ruleName }));
      }

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('CLIENTS_DISTRIBUTION.UPDATE_RULE_FAILED'),
      });
    }
  };

  return (
    <Formik
      initialValues={{
        ruleName: distributionRule?.name || '',
        ruleOrder: distributionRule?.order || 0,
      }}
      validate={Utils.createValidator({
        ruleName: ['required', 'string'],
        ruleOrder: ['required', 'numeric'],
      }, {
        ruleName: I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.NAME'),
        ruleOrder: I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.ORDER'),
      }, false)}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty, isSubmitting, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('CLIENTS_DISTRIBUTION.UPDATE_MODAL.HEADER')}
          buttonTitle={I18n.t('COMMON.BUTTONS.UPDATE')}
          disabled={!isValid || !dirty || isSubmitting}
          clickSubmit={submitForm}
        >
          <Form>
            <If condition={!!formError}>
              <div className="UpdateDistributionRuleModal__error">
                {formError}
              </div>
            </If>

            <Field
              name="ruleName"
              type="text"
              data-testid="UpdateDistributionRuleModal-ruleNameInput"
              label={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.NAME')}
              placeholder={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.NAME')}
              component={FormikInputField}
            />

            <Field
              name="ruleOrder"
              type="number"
              data-testid="UpdateDistributionRuleModal-ruleOrderInput"
              label={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.ORDER')}
              placeholder={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.ORDER')}
              component={FormikInputField}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(UpdateDistributionRuleModal);
