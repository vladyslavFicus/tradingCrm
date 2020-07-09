import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import Dropzone from 'react-dropzone';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import uploadLeadsMutation from './graphql/uploadLeadsMutation';
import './LeadsUploadModal.scss';

const fileConfig = {
  maxSize: 10,
  types: ['.csv'],
};

class LeadsUploadModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    uploadLeads: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
  }

  handleRejectUpload = ([file]) => {
    const { notify } = this.props;

    if (file.size > fileConfig.maxSize) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.UPLOAD_FAILED'),
        message: I18n.t('error.multipart.max-file-size.exceeded', { size: fileConfig.maxSize }),
      });
    }
  }

  handleUploadCSV = async ([file]) => {
    const {
      notify,
      onSuccess,
      uploadLeads,
      onCloseModal,
    } = this.props;

    try {
      await uploadLeads({ variables: { file } });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('COMMON.UPLOAD_SUCCESSFUL'),
      });

      onCloseModal();
      onSuccess();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('COMMON.UPLOAD_FAILED'),
        message: error.error
          ? I18n.t(error.error, { size: fileConfig.maxSize })
          : I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  render() {
    const { isOpen, onCloseModal } = this.props;

    return (
      <Modal className="LeadsUploadModal" isOpen={isOpen} toggle={onCloseModal}>
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('LEADS.LEADS_UPLOAD_MODAL.TITLE')}
        </ModalHeader>
        <ModalBody>
          <div className="LeadsUploadModal__desc">
            <div className="LeadsUploadModal__desc-title">
              {I18n.t('LEADS.LEADS_UPLOAD_MODAL.UPLOAD_CSV_TO_IMPORT_LEADS')}
            </div>
            <div className="LeadsUploadModal__desc-subtitle">
              {`${I18n.t('LEADS.LEADS_UPLOAD_MODAL.SAMPLE_CSV')}: `}
              <a href="/uploads/leads-upload.csv" target="_blank">leads-upload.csv</a>
            </div>
          </div>

          <Dropzone
            accept={fileConfig.types}
            maxSize={fileConfig.maxSize * 1024 * 1024}
            onDropAccepted={this.handleUploadCSV}
            onDropRejected={this.handleRejectUpload}
            className="LeadsUploadModal__dropzone"
            activeClassName="LeadsUploadModal__dropzone-active"
            acceptClassName="LeadsUploadModal__dropzone-accept"
          >
            <div className="LeadsUploadModal__dropzone-content">
              <img src="/img/upload-icon.svg" className="LeadsUploadModal__dropzone-upload-image" alt="" />
              <div className="LeadsUploadModal__dropzone-info">
                <p>{I18n.t('FILE_DROPZONE.DRAG_HERE_OR')}</p>
                <Button className="LeadsUploadModal__dropzone-button">
                  {I18n.t('FILE_DROPZONE.BROWSE_FILES')}
                </Button>
              </div>
            </div>
          </Dropzone>
        </ModalBody>
        <ModalFooter>
          <Button
            common
            onClick={onCloseModal}
          >
            {I18n.t('COMMON.CANCEL')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    uploadLeads: uploadLeadsMutation,
  }),
)(LeadsUploadModal);
