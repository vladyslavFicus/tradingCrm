import React, { useState } from 'react';
import I18n from 'i18n-js';
import { useHistory } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { createValidator } from 'utils/validator';
import { useCreateDistributionRuleMutation } from './graphql/__generated__/CreateDistributionRuleMutation';
import './CreateRuleModal.scss';

type FormValues = {
  ruleName: string,
  ruleOrder: number,
};

type Props = {
  onCloseModal: () => void,
};

const CreateRuleModal = (props: Props) => {
  const { onCloseModal } = props;

  const history = useHistory();

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

      history.push(`/distribution/${uuid}/rule`);

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS_DISTRIBUTION.UPDATE_RULE_SUCCESS', { ruleName: values.ruleName }),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.entity.already.exist') {
        setFormError(I18n.t('CLIENTS_DISTRIBUTION.CREATE_RULE_EXIST', { ruleName: error?.errorParameters?.ruleName }));
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('CLIENTS_DISTRIBUTION.CREATE_RULE_FAILED'),
        });
      }
    }
  };

  return (
    <Modal toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          ruleName: '',
          ruleOrder: 1,
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
              <div>{I18n.t('CLIENTS_DISTRIBUTION.CREATE_MODAL.HEADER')}</div>
            </ModalHeader>

            <ModalBody>
              <If condition={!!formError}>
                <div className="CreateRuleModal__error">
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
                {I18n.t('COMMON.BUTTONS.CREATE')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(CreateRuleModal);
