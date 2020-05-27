import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';

const attributeLabels = {
  reason: 'COMMON.REASON',
};

class ChangeAccountStatusModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    reasons: PropTypes.objectOf(PropTypes.string).isRequired,
  }

  handleSubmit = (values, { setSubmitting }) => {
    const { onSubmit, onCloseModal } = this.props;

    onSubmit(values, onCloseModal);
    setSubmitting(false);
  }

  render() {
    const {
      isOpen,
      reasons,
      onCloseModal,
    } = this.props;

    const reasonsKeys = Object.keys(reasons);

    return (
      <Modal className="modal-danger" toggle={onCloseModal} isOpen={isOpen}>
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
          onSubmit={this.handleSubmit}
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
              </ModalBody>

              <ModalFooter>
                <Button
                  onClick={onCloseModal}
                  common
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
  }
}

export default ChangeAccountStatusModal;
