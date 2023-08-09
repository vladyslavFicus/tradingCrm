import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Utils } from '@crm/common';
import { FormikSelectField, FormikTextAreaField } from 'components/Formik';
import Modal from 'components/Modal';
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
    <Formik
      initialValues={{
        reason: reasonsKeys.length === 1
          ? reasons[reasonsKeys[0]]
          : '',
      }}
      validate={
            Utils.createValidator({
              reason: ['required'],
            }, Utils.translateLabels(attributeLabels), false)
          }
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('MODALS.CHANGE_ACCOUNT_STATUS_MODAL.TITLE')}
          disabled={isSubmitting}
          styleButton="danger"
          buttonTitle={I18n.t('MODALS.CHANGE_ACCOUNT_STATUS_MODAL.SUBMIT_BUTTON')}
          clickSubmit={submitForm}
        >
          <Form>
            <Field
              name="reason"
              data-testid="ChangeAccountStatusModal-reasonSelect"
              placeholder={I18n.t('COMMON.SELECT_OPTION.STATUS')}
              label={I18n.t(attributeLabels.reason)}
              component={FormikSelectField}
            >
              {reasonsKeys.map(key => (
                <option key={key} value={key}>
                  {I18n.t(Utils.renderLabel(key, reasons))}
                </option>
              ))}
            </Field>

            <If condition={!!withComment}>
              <Field
                name="comment"
                data-testid="ChangeAccountStatusModal-commentTextArea"
                placeholder={`${I18n.t('COMMON.COMMENT')}...`}
                label={I18n.t(attributeLabels.comment)}
                component={FormikTextAreaField}
              />
            </If>

            <If condition={!!message}>
              {message}
            </If>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(ChangeAccountStatusModal);
