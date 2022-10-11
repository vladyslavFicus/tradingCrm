import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button } from 'components/UI';
import './UpdateVersionModal.scss';

class UpdateVersionModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
  }

  render() {
    const { isOpen } = this.props;

    return (
      <Modal isOpen={isOpen} className="UpdateVersionModal">
        <ModalHeader className="UpdateVersionModal__header">
          {I18n.t('COMMON.UPDATE_VERSION_MODAL.TITLE')}
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <b>{I18n.t('COMMON.UPDATE_VERSION_MODAL.TEXT')}</b>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            danger
            onClick={() => window.location.reload(true)}
          >
            {I18n.t('COMMON.BUTTONS.UPDATE_NOW')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default UpdateVersionModal;
