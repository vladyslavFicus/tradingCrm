import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './CancelLimitModal.scss';
import CommonGridView from '../CommonGridView';
import PropTypes from '../../../../../../constants/propTypes';

class CancelLimitModal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    data: PropTypes.limitEntity,
    modalTitle: PropTypes.string.isRequired,
    modalSubTitle: PropTypes.string.isRequired,
    cancelButtonLabel: PropTypes.string.isRequired,
    submitButtonLabel: PropTypes.string.isRequired,
    noteText: PropTypes.string.isRequired,
  };

  render() {
    const {
      onClose,
      onSubmit,
      isOpen,
      data,
      modalTitle,
      modalSubTitle,
      cancelButtonLabel,
      submitButtonLabel,
      noteText,
    } = this.props;

    return (
      <Modal className="cancel-limit-modal" toggle={onClose} isOpen={isOpen}>
        <ModalHeader toggle={onClose}>{modalTitle}</ModalHeader>
        <ModalBody>
          <div className="row text-center font-weight-700 margin-bottom-15">
            {modalSubTitle}
          </div>
          <CommonGridView
            dataSource={[this.props.data]}
            insideModal
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
