import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
import { NasSelectField } from '../../../../../../components/ReduxForm';
import { aquisitionStatuses } from '../../../../../../constants/aquisitionStatuses';
import { createValidator } from '../../../../../../utils/validator';

class MoveModal extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.any,
    clientsSelected: PropTypes.number.isRequired,
  };

  static defaultProps ={
    error: null,
  };

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      invalid,
      pristine,
      submitting,
      onSubmit,
      error,
      clientsSelected,
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <ModalHeader toggle={onCloseModal}>
          <div>{I18n.t('CLIENTS.MODALS.MOVE_MODAL.MOVE_HEADER')}</div>
          <div className="font-size-11 color-yellow">{clientsSelected}{' '}{I18n.t('COMMON.CLIENTS_SELECTED')}</div>
        </ModalHeader>
        <ModalBody
          tag="form"
          id="move-modal-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <If condition={error}>
            <div className="mb-2 text-center color-danger">
              {error}
            </div>
          </If>
          <Field
            name="aquisitionStatus"
            label={I18n.t('CLIENTS.MODALS.MOVE_MODAL.MOVE_LABEL')}
            component={NasSelectField}
            disabled={submitting}
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          >
            {aquisitionStatuses.map(({ value, label }) => (
              <option key={value} value={value}>
                {I18n.t(label)}
              </option>
            ))}
          </Field>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-default-outline"
            onClick={onCloseModal}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button
            type="submit"
            disabled={invalid || pristine || submitting}
            className="btn btn-primary"
            form="move-modal-form"
          >
            {I18n.t('CLIENTS.MODALS.SUBMIT')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

const FORM_NAME = 'moveModalForm';

export default reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate: values => createValidator({ aquisitionStatus: ['string', 'required'] }, {}, false)(values),
})(MoveModal);
