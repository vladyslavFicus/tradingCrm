import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator } from 'utils/validator';
import { useDistributionRuleQuery } from './graphql/__generated__/DistributionRuleQuery';
import { useUpdateDistributionRuleMutation } from './graphql/__generated__/UpdateDistributionRuleMutation';
import './EditRuleNameModal.scss';

type FormValues = {
  ruleName: string,
  ruleOrder: number,
};

type Props = {
  uuid: string,
  onCloseModal: () => void,
};

const EditRuleNameModal = (props: Props) => {
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
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS_DISTRIBUTION.UPDATE_RULE_SUCCESS', { ruleName: values.ruleName }),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.entity.already.exist') {
        setFormError(I18n.t('CLIENTS_DISTRIBUTION.CREATE_RULE_EXIST', { ruleName: error?.errorParameters?.ruleName }));
      }

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('CLIENTS_DISTRIBUTION.UPDATE_RULE_FAILED'),
      });
    }
  };

  return (
    <Modal toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          ruleName: distributionRule?.name || '',
          ruleOrder: distributionRule?.order || 0,
        }}
        validate={createValidator({
          ruleName: ['required', 'string'],
          ruleOrder: ['required', 'numeric'],
        }, {
          ruleName: I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.NAME'),
          ruleOrder: I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.ORDER'),
        }, false)}
        onSubmit={handleSubmit}
      >
        {({ isValid, dirty, isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              <div>{I18n.t('CLIENTS_DISTRIBUTION.UPDATE_MODAL.HEADER')}</div>
            </ModalHeader>

            <ModalBody>
              <If condition={!!formError}>
                <div className="EditRuleNameModal__error">
                  {formError}
                </div>
              </If>

              <Field
                name="ruleName"
                type="text"
                label={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.NAME')}
                placeholder={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.NAME')}
                component={FormikInputField}
              />

              <Field
                name="ruleOrder"
                type="number"
                label={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.ORDER')}
                placeholder={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.ORDER')}
                component={FormikInputField}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                tertiary
                onClick={onCloseModal}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                primary
                type="submit"
                disabled={!isValid || !dirty || isSubmitting}
              >
                {I18n.t('COMMON.BUTTONS.UPDATE')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(EditRuleNameModal);
