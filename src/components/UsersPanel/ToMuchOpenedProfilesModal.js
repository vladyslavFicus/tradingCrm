import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { shortify } from '../../utils/uuid';

class ToMuchOpenedProfilesModal extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    newPlayer: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onReplace: PropTypes.func.isRequired,
  };

  state = {
    selectedItems: [],
  };

  handleTabChecked = (e) => {
    const { items } = this.props;
    const { selectedItems } = this.state;
    const selectedItem = items[e.target.value];

    if (selectedItem) {
      if (e.target.checked) {
        this.setState({ selectedItems: [...selectedItems, selectedItem] });
      } else {
        const index = selectedItems.indexOf(selectedItem);

        if (index > -1) {
          const newSelectedItems = [...selectedItems];
          newSelectedItems.splice(index, 1);

          this.setState({ selectedItems: newSelectedItems });
        }
      }
    }
  };

  handleSubmit = () => {
    const { selectedItems } = this.state;
    const { onReplace, newPlayer } = this.props;

    onReplace(selectedItems, [newPlayer]);
  };

  render() {
    const { items, newPlayer, onClose } = this.props;
    const { selectedItems } = this.state;

    return (
      <Modal className="modal-danger modal-to-much-opened-profiles" toggle={onClose} isOpen>
        <ModalHeader toggle={onClose}>
          {I18n.t('TO_MUCH_OPENED_PROFILES_MODAL.TITLE')}
        </ModalHeader>

        <ModalBody>
          <div className="text-center font-weight-700 font-size-16 line-height-1">
            {I18n.t('TO_MUCH_OPENED_PROFILES_MODAL.HEADING')}
          </div>
          <div className="margin-top-10 text-center font-weight-700 line-height-1">
            {I18n.t('TO_MUCH_OPENED_PROFILES_MODAL.FIRST_TEXT')}
            {newPlayer.fullName} - <span className="font-weight-400">{shortify(newPlayer.uuid, 'PL')}</span>
            <br />
            {I18n.t('TO_MUCH_OPENED_PROFILES_MODAL.SECOND_TEXT')}
          </div>
          <div className="margin-top-20">
            {
              items.map((tab, index) => (
                <div className={`users-panel-footer__tab tab-${tab.color}`} key={tab.uuid}>
                  <div className="users-panel-footer__tab__block">
                    <div className="users-panel-footer__tab__name">
                      {tab.fullName}
                    </div>
                    <div className="users-panel-footer__tab__info">
                      {`${tab.login} - ${shortify(tab.uuid, 'PL')}`}
                    </div>
                  </div>
                  <div className="checkbox custom-checkbox">
                    <label>
                      <input type="checkbox" onChange={this.handleTabChecked} value={index} />
                      <i className="nas nas-check_box custom-checkbox-icon" />
                    </label>
                  </div>
                </div>
              ))
            }
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            type="reset"
            className="btn btn-default-outline margin-right-5"
            onClick={onClose}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button
            type="submit"
            className="btn btn-danger"
            disabled={selectedItems.length === 0}
            onClick={this.handleSubmit}
          >
            {I18n.t('TO_MUCH_OPENED_PROFILES_MODAL.CLOSE_SELECTED_BUTTON')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ToMuchOpenedProfilesModal;
