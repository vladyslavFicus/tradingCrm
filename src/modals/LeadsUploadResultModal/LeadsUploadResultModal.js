import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import './LeadsUploadResultModal.scss';

class LeadsUploadResultModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    uploadLeadsResult: PropTypes.arrayOf(PropTypes.leadResult).isRequired,
  };

  handleClose = () => {
    const { onCloseModal } = this.props;

    onCloseModal();
  }

  createCsvFile = () => {
    const { uploadLeadsResult } = this.props;
    const keys = Object.keys(uploadLeadsResult[0]).filter(key => key !== '__typename');

    return encodeURI(`data:text/csv;charset=utf-8, ${
      [
        keys,
        ...uploadLeadsResult.map(({ __typename, ...uploadLeadResult }) => (
          Object.values({
            ...uploadLeadResult,
            failureReason: I18n.t(`MODALS.LEADS_UPLOAD_RESULT_MODAL.FAILURE_REASON.${uploadLeadResult?.failureReason}`),
          })
        )),
      ].map(e => e.join(',')).join('\n')
    }`);
  }

  render() {
    const {
      isOpen,
      uploadLeadsResult,
    } = this.props;

    return (
      <Modal className="LeadsUploadResultModal" isOpen={isOpen} toggle={this.handleClose}>
        <ModalHeader toggle={this.handleClose}>{I18n.t('MODALS.LEADS_UPLOAD_RESULT_MODAL.TITLE')}</ModalHeader>
        <ModalBody>
          <div className="LeadsUploadResultModal__row LeadsUploadResultModal__action-text">
            {I18n.t('MODALS.LEADS_UPLOAD_RESULT_MODAL.DESCRIPTION', { count: uploadLeadsResult.length })}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            commonOutline
            onClick={this.handleClose}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </Button>
          <Button danger>
            <a href={this.createCsvFile()} download="report">{I18n.t('COMMON.BUTTONS.DOWNLOAD')}</a>
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default LeadsUploadResultModal;
