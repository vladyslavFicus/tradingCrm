import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { FormikSelectField, FormikTextAreaField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { attributeLabels } from './constants';

export type FormValues = {
  reason: string,
  comment?: string,
};

export type Props = {
  onSubmit: (reason: FormValues, action: (submit: boolean) => void) => void,
  onCloseModal: () => void,
  reasons: Record<string, string>,
  message?: string | React.ReactNode,
  withComment?: boolean,
};

const ChangeAccountStatusModal = (props: Props) => {
  const {
    message,
    reasons,
    withComment,
    onSubmit,
    onCloseModal,
  } = props;

  const reasonsKeys = Object.keys(reasons);

  const handleSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    onSubmit(values, setSubmitting);
    setSubmitting(false);
  };

  return (
    <Modal
      className="ChangeAccountStatusModal modal-danger"
      toggle={onCloseModal}
      isOpen
    >
      <ModalHeader
        toggle={onCloseModal}
      >
        {I18n.t('MODALS.CHANGE_ACCOUNT_STATUS_MODAL.TITLE')}
      </ModalHeader>

      <Formik
        initialValues={{
          reason: reasonsKeys.length === 1
            ? reasons[reasonsKeys[0]]
            : '',
        }}
        validate={
            createValidator({
              reason: ['required'],
            }, translateLabels(attributeLabels), false)
          }
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalBody>
              <Field
                name="reason"
                placeholder={I18n.t('COMMON.SELECT_OPTION.STATUS')}
                label={I18n.t(attributeLabels.reason)}
                component={FormikSelectField}
              >
                {reasonsKeys.map(key => (
                  <option key={key} value={key}>
                    {I18n.t(renderLabel(key, reasons))}
                  </option>
                ))}
              </Field>

              <If condition={!!withComment}>
                <Field
                  name="comment"
                  placeholder={`${I18n.t('COMMON.COMMENT')}...`}
                  label={I18n.t(attributeLabels.comment)}
                  component={FormikTextAreaField}
                />
              </If>

              <If condition={!!message}>
                {message}
              </If>
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={onCloseModal}
                secondary
              >
                {I18n.t('COMMON.CANCEL')}
              </Button>

              <Button
                disabled={isSubmitting}
                type="submit"
                danger
              >
                {I18n.t('MODALS.CHANGE_ACCOUNT_STATUS_MODAL.SUBMIT_BUTTON')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(ChangeAccountStatusModal);
