import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';

const getStatusColor = errors => (errors.length > 0 ? 'color-danger' : 'color-success');

const HierarchyInfoModal = ({
  onCloseModal,
  isOpen,
  header,
  status,
  data,
  error,
}) => (
  <Modal
    toggle={onCloseModal}
    isOpen={isOpen}
  >
    <ModalHeader toggle={onCloseModal}>
      {I18n.t('HIERARCHY.INFO_MODAL.HEADER')}
    </ModalHeader>
    <ModalBody>
      <div className="mb-3 font-weight-700 text-center">
        {header}: <span className={`text-uppercase ${getStatusColor(error)}`}>{status}</span>
      </div>
      {data.map(item => (
        <div key={item} className="col">
          <i className="fa fa-check text-success" /> {I18n.t(item)}
        </div>
      ))}
      {error.map(item => (
        <div key={item} className="col">
          <i className="fa fa-times text-danger" /> {I18n.t(item)}
        </div>
      ))}
    </ModalBody>
    <ModalFooter>
      <button
        type="button"
        className="btn btn-default-outline"
        onClick={onCloseModal}
      >
        {I18n.t('COMMON.BUTTONS.CANCEL')}
      </button>
    </ModalFooter>
  </Modal>
);

HierarchyInfoModal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  header: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.arrayOf(PropTypes.string),
};

HierarchyInfoModal.defaultProps = {
  data: [],
  error: [],
};

export default HierarchyInfoModal;
