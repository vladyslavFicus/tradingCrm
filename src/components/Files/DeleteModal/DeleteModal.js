import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import EventEmitter, { FILE_REMOVED } from 'utils/EventEmitter';
import DeleteFileMutation from './graphql/DeleteFileMutation';

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

    const {
      data: {
        file: {
          delete: {
            error,
          },
        },
      },
    } = await deleteFile({ variables: { uuid: file.uuid } });

    if (!error) {
      EventEmitter.emit(FILE_REMOVED, file);

      onCloseModal();
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
          <button type="button" className="btn btn-default-outline mr-auto" onClick={onCloseModal}>
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button type="button" className="btn btn-danger" onClick={this.handleDelete}>
            {I18n.t('FILES.DELETE_MODAL.BUTTONS.DELETE')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default withRequests({
  deleteFile: DeleteFileMutation,
})(DeleteModal);
