import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createValidator } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';

class RenameModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    fileName: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  onSubmit = ({ title }) => {
    const {
      onSubmit,
    } = this.props;

    onSubmit(title);
  };

  render() {
    const {
      fileName,
      onCloseModal,
    } = this.props;

    return (
      <Modal className="modal-danger" toggle={onCloseModal} isOpen>
        <Formik
          initialValues={{}}
          validate={createValidator({
            title: 'required',
          })}
          onSubmit={this.onSubmit}
        >
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('FILES.RENAME_MODAL.TITLE')}
            </ModalHeader>
            <ModalBody className="text-center">
              <div className="margin-bottom-20 font-weight-700">
                {I18n.t('FILES.RENAME_MODAL.ACTION_TEXT', { fileName })}
              </div>
              <Field
                name="title"
                component={FormikInputField}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                commonOutline
                className="mr-auto"
                onClick={onCloseModal}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                danger
                type="submit"
              >
                {I18n.t('COMMON.BUTTONS.CONFIRM')}
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </Modal>
    );
  }
}

export default RenameModal;
