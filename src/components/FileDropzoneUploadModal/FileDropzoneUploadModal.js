import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import FileDropzoneUpload from '../FileDropzoneUpload';

class FileDropzoneUploadModal extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    renderTopContent: PropTypes.element,
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    contentClassName: PropTypes.string,
    ...FileDropzoneUpload.propTypes, // eslint-disable-line
  };

  static defaultProps = {
    title: null,
    renderTopContent: null,
    contentClassName: null,
  };

  render() {
    const {
      title,
      renderTopContent,
      isOpen,
      onCloseModal,
      contentClassName,
      ...fileDropzoneUploadProps
    } = this.props;

    return (
      <Modal isOpen={isOpen} className="upload-modal" toggle={onCloseModal}>
        <ModalHeader toggle={onCloseModal}>
          {title || I18n.t('FILES.UPLOAD_MODAL.TITLE')}
        </ModalHeader>
        <ModalBody className={contentClassName}>
          {renderTopContent}
          <FileDropzoneUpload {...fileDropzoneUploadProps} />
        </ModalBody>
        <ModalFooter>
          <Button
            color="light"
            className="margin-right-5"
            onClick={onCloseModal}
          >
            {I18n.t('COMMON.CANCEL')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default FileDropzoneUploadModal;
