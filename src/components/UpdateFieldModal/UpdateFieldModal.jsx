import React from 'react';
import { Modal } from 'reactstrap';
import PropTypes from '../../constants/propTypes';
import UpdateFieldForm from './UpdateFieldForm';

const UpdateFieldModal = ({ isOpen, form, onCloseModal, ...props }) => (
  <Modal isOpen={isOpen} toggle={onCloseModal} className="modal-danger">
    <UpdateFieldForm key={form} {...props} />
  </Modal>
);

UpdateFieldModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default UpdateFieldModal;
