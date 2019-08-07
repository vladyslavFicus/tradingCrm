import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'constants/propTypes';
import { NasSelectField } from 'components/ReduxForm';
import { withNotifications } from 'components/HighOrder';
import { aquisitionStatuses } from 'constants/aquisitionStatuses';
import { createValidator } from 'utils/validator';
import { checkMovePermission } from './utils';

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
    selectedData: PropTypes.object,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedData: {},
    error: null,
  };

  handleMoveSubmit = ({ aquisitionStatus }) => {
    const { selectedData, notify } = this.props;

    const actionForbidden = checkMovePermission({ ...selectedData, aquisitionStatus });

    if (actionForbidden) {
      const type = aquisitionStatus.toLowerCase();

      notify({
        level: 'error',
        title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
        message: I18n.t('clients.bulkUpdate.moveForbidden', { type }),
      });

      throw new SubmissionError({
        _error: I18n.t('clients.bulkUpdate.detailedTypeError', { type }),
      });
    }

    this.props.onSubmit({ aquisitionStatus });
  }

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      invalid,
      pristine,
      submitting,
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
          onSubmit={handleSubmit(this.handleMoveSubmit)}
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

export default withNotifications(
  reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    validate: values => createValidator({ aquisitionStatus: ['string', 'required'] }, {}, false)(values),
  })(MoveModal),
);
