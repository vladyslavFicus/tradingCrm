import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CommonGridView from '../CommonGridView';
import PropTypes from '../../../../../../../../constants/propTypes';

const CancelLimitModal = (props) => {
  const {
    onClose,
    onSubmit,
    data,
    modalTitle,
    modalSubTitle,
    cancelButtonLabel,
    submitButtonLabel,
    noteText,
    locale,
  } = props;

  return (
    <Modal toggle={onClose} isOpen>
      <ModalHeader toggle={onClose}>{modalTitle}</ModalHeader>
      <ModalBody>
        <div className="text-center font-weight-700 margin-bottom-15">
          {modalSubTitle}
        </div>
        <CommonGridView
          dataSource={[data]}
          insideModal
          locale={locale}
        />
      </ModalBody>

      <ModalFooter>
        <div className="row">
          <div className="col-sm-5 text-muted font-size-12">
            <b>Note</b>: {noteText}
          </div>
          <div className="col-sm-7 text-right">
            <button
              type="reset"
              className="btn btn-default-outline"
              onClick={onClose}
            >
              {cancelButtonLabel}
            </button>

            <button
              type="submit"
              className="btn btn-primary margin-left-5"
              onClick={() => onSubmit(data.type, data.uuid)}
            >
              {submitButtonLabel}
            </button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

CancelLimitModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.limitEntity.isRequired,
  modalTitle: PropTypes.string.isRequired,
  modalSubTitle: PropTypes.string.isRequired,
  cancelButtonLabel: PropTypes.string.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
  noteText: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

export default CancelLimitModal;
