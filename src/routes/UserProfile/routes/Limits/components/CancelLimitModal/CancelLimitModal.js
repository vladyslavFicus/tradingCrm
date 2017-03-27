import React, { Component, PropTypes } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
  statuses,
} from '../../../../../../constants/limits';
import './CancelLimitModal.scss';
import CommonGridView from '../CommonGridView';

class CancelLimitModal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    data: PropTypes.object,
  };

  render() {
    const { onClose, onSubmit, isOpen, data } = this.props;

    let cancelButtonLabel;
    let submitButtonLabel;
    let modalTitle;
    let modalSubTitle;
    let noteText;

    if (data.status === statuses.IN_PROGRESS) {
      modalTitle = 'Cancel limit';
      modalSubTitle = 'You are about to cancel the wager limit';
      cancelButtonLabel = 'Leave active';
      submitButtonLabel = 'Cancel limit';
      noteText = 'The limit can only be canceled after the cool off period';
    } else if (data.status === statuses.PENDING) {
      modalTitle = 'Dismiss pending limit';
      modalSubTitle = 'You are about to dismiss the pending loss limit';
      cancelButtonLabel = 'Leave pending';
      submitButtonLabel = 'Dismiss limit';
      noteText = 'The limit will be immediately dismissed';
    }

    return (
      <Modal className="cancel-limit-modal" toggle={onClose} isOpen={isOpen}>
        <ModalHeader toggle={onClose}>{modalTitle}</ModalHeader>
        <ModalBody>
          <div className="row text-center font-weight-700 margin-bottom-15">
            {modalSubTitle}
          </div>
          <CommonGridView
            dataSource={[this.props.data]}
            insideModal={false}
          />
        </ModalBody>

        <ModalFooter>
          <div className="row">
            <div className="col-sm-6 text-muted font-size-12">
              <b>Note</b>: {noteText}
            </div>
            <div className="col-sm-6 text-right">
              <button
                type="reset"
                className="btn btn-default-outline text-uppercase"
                onClick={onClose}
              >
                {cancelButtonLabel}
              </button>

              <button
                type="submit"
                className="btn btn-primary text-uppercase"
                onClick={() => onSubmit(data.type, data.uuid)}
              >
                {submitButtonLabel}
              </button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default CancelLimitModal;
