import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { shortify } from '../../utils/uuid';
import deleteFromArray from '../../utils/deleteFromArray';
import Uuid from '../Uuid';

const initialState = {
  itemsToRemove: [],
};

class ReplaceTabsModal extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    onCloseCallback: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
  };

  state = { ...initialState };

  handleClose = () => {
    this.setState({ ...initialState });
    this.props.onCloseModal();
    this.props.onCloseCallback();
  };

  handleTabChecked = (e) => {
    const { itemsToRemove } = this.state;
    const selectedItem = this.props.items[e.target.value];

    if (selectedItem) {
      this.setState({
        itemsToRemove: e.target.checked
          ? [...itemsToRemove, selectedItem]
          : deleteFromArray(itemsToRemove, selectedItem),
      });
    }
  };

  handleSubmit = () => {
    const { itemsToRemove } = this.state;
    const { onSubmit } = this.props;

    onSubmit(itemsToRemove);
  };

  render() {
    const { items, isOpen } = this.props;
    const { itemsToRemove } = this.state;

    const currentItems = items.slice(0, 5);
    const [newItem] = items.slice(-1);

    return (
      <Modal
        className="modal-danger modal-to-much-opened-profiles"
        toggle={this.handleClose}
        isOpen={isOpen}
      >
        <ModalHeader toggle={this.handleClose}>
          {I18n.t('TO_MUCH_OPENED_PROFILES_MODAL.TITLE')}
        </ModalHeader>

        <ModalBody>
          <div className="text-center font-weight-700 font-size-16 line-height-1">
            {I18n.t('TO_MUCH_OPENED_PROFILES_MODAL.HEADING')}
          </div>
          <div className="margin-top-10 text-center font-weight-700 line-height-1">
            {I18n.t('TO_MUCH_OPENED_PROFILES_MODAL.FIRST_TEXT')}
            {newItem.fullName} - <span className="font-weight-400"><Uuid uuid={newItem.uuid} /></span>s
            <br />
            {I18n.t('TO_MUCH_OPENED_PROFILES_MODAL.SECOND_TEXT')}
          </div>
          <div className="margin-top-20">
            {
              currentItems.map((item, index) => (
                <div className={`users-panel-footer__tab tab-${item.color}`} key={item.uuid}>
                  <div className="users-panel-footer__tab__block">
                    <div className="users-panel-footer__tab__name">
                      {item.fullName}
                    </div>
                    <div className="users-panel-footer__tab__info">
                      {`${item.username} - ${shortify(item.uuid, 'PL')}`}
                    </div>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      id={`${index}item`}
                      onChange={this.handleTabChecked}
                      value={index}
                      type="checkbox"
                      className="custom-control-input"
                    />
                    <label className="custom-control-label" htmlFor={`${index}item`} />
                  </div>
                </div>
              ))
            }
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            type="button"
            className="btn btn-default-outline margin-right-5"
            onClick={this.handleClose}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button
            type="submit"
            className="btn btn-danger"
            disabled={!itemsToRemove.length}
            onClick={this.handleSubmit}
          >
            {I18n.t('TO_MUCH_OPENED_PROFILES_MODAL.CLOSE_SELECTED_BUTTON')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ReplaceTabsModal;
