import React, { useState } from 'react';
import I18n from 'i18n-js';
import { useNavigate } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import { Utils, parseErrors, notify, Types } from '@crm/common';
import { FormikInputField } from 'components';
import Modal from 'components/Modal';
import { useCreateDistributionRuleMutation } from './graphql/__generated__/CreateDistributionRuleMutation';
import './CreateDistributionRuleModal.scss';

export type FormValues = {
  ruleName: string,
  ruleOrder: number,
};

export type Props = {
  onCloseModal: () => void,
};

const CreateDistributionRuleModal = (props: Props) => {
  const { onCloseModal } = props;

  const navigate = useNavigate();

  const [formError, setFormError] = useState<string | null>(null);

  // ===== Requests ===== //
  const [createDistributionRule] = useCreateDistributionRuleMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    setFormError(null);

    try {
      const response = await createDistributionRule({ variables: values });

      const uuid = response.data?.distributionRule.create.uuid;

      onCloseModal();

      navigate(`/distribution/${uuid}`);

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS_DISTRIBUTION.UPDATE_RULE_SUCCESS', { ruleName: values.ruleName }),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.entity.already.exist') {
        setFormError(I18n.t('CLIENTS_DISTRIBUTION.CREATE_RULE_EXIST', { ruleName: error?.errorParameters?.ruleName }));
      } else {
        notify({
          level: Types.LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('CLIENTS_DISTRIBUTION.CREATE_RULE_FAILED'),
        });
      }
    }
  };

  return (
    <Formik
      initialValues={{
        ruleName: '',
        ruleOrder: 1,
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
          title={I18n.t('CLIENTS_DISTRIBUTION.CREATE_MODAL.HEADER')}
          disabled={!isValid || !dirty || isSubmitting}
          clickSubmit={submitForm}
          buttonTitle={I18n.t('COMMON.BUTTONS.CREATE')}
        >
          <Form>
            <If condition={!!formError}>
              <div className="CreateDistributionRuleModal__error">
                {formError}
              </div>
            </If>

            <Field
              name="ruleName"
              type="text"
              data-testid="CreateDistributionRuleModal-ruleNameInput"
              label={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.NAME')}
              placeholder={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.NAME')}
              component={FormikInputField}
            />

            <Field
              name="ruleOrder"
              type="number"
              data-testid="CreateDistributionRuleModal-ruleOrderInput"
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

export default React.memo(CreateDistributionRuleModal);
