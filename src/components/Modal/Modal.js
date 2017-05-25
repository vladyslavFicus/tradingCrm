import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal as BootstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Modal extends Component {
  static propTypes = {
    header: PropTypes.any.isRequired,
    body: PropTypes.any.isRequired,
    footer: PropTypes.any,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOpen: false,
  };

  render() {
    const { header, body, footer, onClose, ...rest } = this.props;

    return (
      <BootstrapModal {...rest} toggle={onClose}>
        <ModalHeader toggle={onClose}>{header}</ModalHeader>
        <ModalBody>
          {body}
        </ModalBody>
        {
          footer &&
          <ModalFooter>
            {footer}
          </ModalFooter>
        }
      </BootstrapModal>
    );
  }
}

export default Modal;
