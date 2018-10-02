import React from 'react';
import PropTypes from 'prop-types';
import { Modal as BootstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const PaymentIframeModal = ({ header, redirectLink, footer, onCloseModal, ...rest }) => (
  <BootstrapModal {...rest} toggle={onCloseModal}contentClassName="iframe-modal">
    <ModalHeader toggle={onCloseModal}>{header}</ModalHeader>
    <ModalBody>
      <iframe
        width="100%"
        height="600px"
        sandbox="allow-same-origin  allow-forms allow-scripts"
        className="embed-responsive-item"
        src={`${redirectLink}?cli_callback_app_url=${window.location.href}&payer_country=Sweden`}
        allowFullScreen
      />
    </ModalBody>
  </BootstrapModal>
);

PaymentIframeModal.propTypes = {
  header: PropTypes.any.isRequired,
  body: PropTypes.any.isRequired,
  footer: PropTypes.any,
  isOpen: PropTypes.bool,
  onCloseModal: PropTypes.func.isRequired,
};

PaymentIframeModal.defaultProps = {
  isOpen: false,
  footer: null,
};

export default PaymentIframeModal;
