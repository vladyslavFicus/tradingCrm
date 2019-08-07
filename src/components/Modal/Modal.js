import React from 'react';
import PropTypes from 'prop-types';
import { Modal as BootstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const Modal = ({ header, body, footer, onCloseModal, ...rest }) => (
  <BootstrapModal {...rest} toggle={onCloseModal}>
    <ModalHeader toggle={onCloseModal}>{header}</ModalHeader>
    <ModalBody>
      {body}
    </ModalBody>
    {
      footer
      && (
        <ModalFooter>
          {footer}
        </ModalFooter>
      )
    }
  </BootstrapModal>
);

Modal.propTypes = {
  header: PropTypes.any.isRequired,
  body: PropTypes.any.isRequired,
  footer: PropTypes.any,
  isOpen: PropTypes.bool,
  onCloseModal: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  isOpen: false,
  footer: null,
};

export default Modal;
