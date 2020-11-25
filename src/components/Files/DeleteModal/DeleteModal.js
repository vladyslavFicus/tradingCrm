import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import EventEmitter, { FILE_REMOVED } from 'utils/EventEmitter';
import DeleteFileMutation from './graphql/DeleteFileMutation';

class DeleteModal extends PureComponent {
  static propTypes = {
    file: PropTypes.fileEntity.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleDelete = async () => {
    const {
      file,
      notify,
      deleteFile,
      onCloseModal,
    } = this.props;

    try {
      await deleteFile({ variables: { uuid: file.uuid } });

      EventEmitter.emit(FILE_REMOVED, file);

      onCloseModal();

      notify({
        level: 'success',
        title: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.TITLE'),
        message: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.SUCCESS'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.TITLE'),
        message: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.ERROR'),
      });
    }
  };

  render() {
    const {
      file,
      onCloseModal,
    } = this.props;

    return (
      <Modal className="modal-danger" toggle={onCloseModal} isOpen>
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('FILES.DELETE_MODAL.TITLE')}
        </ModalHeader>
        <ModalBody className="text-center">
          <div
            className="margin-bottom-20 font-weight-700"
            dangerouslySetInnerHTML={{
              __html: I18n.t('FILES.DELETE_MODAL.ACTION_TEXT', {
                fileName: file.fileName,
              }),
            }}
          />
          <div className="margin-bottom-20"> {I18n.t('FILES.DELETE_MODAL.WARNING_TEXT')} </div>
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
            onClick={this.handleDelete}
          >
            {I18n.t('FILES.DELETE_MODAL.BUTTONS.DELETE')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    deleteFile: DeleteFileMutation,
  }),
)(DeleteModal);
