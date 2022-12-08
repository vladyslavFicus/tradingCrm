import React, { PureComponent } from 'react';
import compose from 'compose-function';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import EventEmitter, { FILE_REMOVED } from 'utils/EventEmitter';
import DeleteFileMutation from './graphql/DeleteFileMutation';
import './DeleteModal.scss';

class DeleteModal extends PureComponent {
  static propTypes = {
    file: PropTypes.fileEntity.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
  };

  handleDelete = async () => {
    const {
      file,
      deleteFile,
      onCloseModal,
    } = this.props;

    try {
      await deleteFile({ variables: { uuid: file.uuid } });

      EventEmitter.emit(FILE_REMOVED, file);

      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.TITLE'),
        message: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.SUCCESS'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
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
      <Modal className="DeleteModal" toggle={onCloseModal} isOpen>
        <ModalHeader toggle={onCloseModal} className="DeleteModal__header">
          {I18n.t('FILES.DELETE_MODAL.TITLE')}
        </ModalHeader>
        <ModalBody className="text-center">
          <div
            dangerouslySetInnerHTML={{
              __html: I18n.t('FILES.DELETE_MODAL.ACTION_TEXT', {
                fileName: file.fileName,
              }),
            }}
          />
          <div className="DeleteModal__warning"> {I18n.t('FILES.DELETE_MODAL.WARNING_TEXT')} </div>
        </ModalBody>
        <ModalFooter>
          <Button
            tertiary
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
  withRequests({
    deleteFile: DeleteFileMutation,
  }),
)(DeleteModal);
