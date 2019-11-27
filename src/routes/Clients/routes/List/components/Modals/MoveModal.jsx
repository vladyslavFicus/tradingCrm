import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, SubmissionError } from 'redux-form';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { NasSelectField } from 'components/ReduxForm';
import { aquisitionStatuses } from 'constants/aquisitionStatuses';
import { checkMovePermission } from './utils';
import { getClientsData } from '../utils';

class MoveModal extends PureComponent {
  static propTypes = {
    error: PropTypes.any,
    configs: PropTypes.shape({
      allRowsSelected: PropTypes.bool,
      totalElements: PropTypes.number,
      selectedRows: PropTypes.arrayOf(PropTypes.number),
      touchedRowsIds: PropTypes.arrayOf(PropTypes.string),
      searchParams: PropTypes.object,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    content: PropTypes.arrayOf(PropTypes.object).isRequired,
    bulkRepresentativeUpdate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: null,
  };

  handleMoveSubmit = async ({ acquisitionStatus }) => {
    const {
      notify,
      configs,
      configs: {
        totalElements,
      },
      content,
      onSuccess,
      onCloseModal,
      bulkRepresentativeUpdate,
    } = this.props;

    const actionForbidden = checkMovePermission({ ...configs, content, acquisitionStatus });
    const type = acquisitionStatus;

    if (actionForbidden) {
      const typeLowercased = acquisitionStatus.toLowerCase();
      notify({
        level: 'error',
        title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
        message: I18n.t('clients.bulkUpdate.moveForbidden', { type: typeLowercased }),
      });

      throw new SubmissionError({
        _error: I18n.t('clients.bulkUpdate.detailedTypeError', { type: typeLowercased }),
      });
    }

    const isMoveAction = true;
    const clients = getClientsData(configs, totalElements, { type, isMoveAction }, content);

    const { error } = await bulkRepresentativeUpdate({
      variables: {
        type,
        clients,
        isMoveAction,
        totalElements,
        ...configs,
      },
    });

    if (error) {
      // when we try to move clients, when they don't have assigned {{type}} representative
      // GQL will return exact this error and we catch it to show custom message
      const condition = error.error && error.error === 'clients.bulkUpdate.moveForbidden';

      notify({
        level: 'error',
        title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
        message: condition
          ? I18n.t(error.error, { type })
          : I18n.t('COMMON.SOMETHING_WRONG'),
      });

      if (condition) {
        throw new SubmissionError({
          _error: I18n.t('clients.bulkUpdate.detailedTypeError', { type }),
        });
      }
    } else {
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS.ACQUISITION_STATUS_UPDATED'),
      });

      onCloseModal();
      onSuccess();
    }
  }

  render() {
    const {
      error,
      isOpen,
      invalid,
      pristine,
      submitting,
      onCloseModal,
      handleSubmit,
      configs: { selectedRows },
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <ModalHeader toggle={onCloseModal}>
          <div>{I18n.t('CLIENTS.MODALS.MOVE_MODAL.MOVE_HEADER')}</div>
          <div className="font-size-11 color-yellow">{selectedRows.length}{' '}{I18n.t('COMMON.CLIENTS_SELECTED')}</div>
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
            name="acquisitionStatus"
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

export default MoveModal;
