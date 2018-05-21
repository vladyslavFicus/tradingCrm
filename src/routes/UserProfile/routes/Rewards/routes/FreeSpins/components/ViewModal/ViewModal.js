import React, { Component } from 'react';
import { get } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import { targetTypes } from '../../../../../../../../constants/note';
import ViewModalMain from '../ViewModalMain';
import ViewModalAdditional from '../ViewModalAdditional';
import ViewModalStatistics from '../ViewModalStatistics';
import NoteButton from '../../../../../../../../components/NoteButton';

class ViewModal extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.any.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string.isRequired,
    })).isRequired,
    freeSpin: PropTypes.shape({
      freeSpin: PropTypes.shape({
        data: PropTypes.freeSpinEntity,
      }),
    }).isRequired,
    isOpen: PropTypes.bool,
    onCloseModal: PropTypes.func.isRequired,
    optionCurrencies: PropTypes.shape({
      options: PropTypes.shape({
        signUp: PropTypes.shape({
          currency: PropTypes.shape({
            rates: PropTypes.arrayOf(PropTypes.price),
          }),
        }),
      }),
    }).isRequired,
    note: PropTypes.noteEntity,
  };

  static defaultProps = {
    isOpen: false,
    note: null,
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  get rates() {
    const { optionCurrencies: { options } } = this.props;

    return get(options, 'signUp.post.currency.rates', []);
  }

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.onEditNoteClick(target, note, { placement: 'top' });
    } else {
      this.context.onAddNoteClick(data.uuid, targetTypes.FREE_SPIN)(target, { placement: 'top' });
    }
  };

  renderNote = data => (
    <div className="text-center">
      <NoteButton
        id="free-spin-detail-modal-note"
        note={this.props.note}
        onClick={this.handleNoteClick}
        targetEntity={data}
        preview
      />
    </div>
  );

  render() {
    const {
      freeSpin,
      actions,
      isOpen,
      onCloseModal,
    } = this.props;

    const freeSpinData = get(freeSpin, 'freeSpin.data');

    if (!freeSpinData) {
      return null;
    }

    const { rates } = this;

    return (
      <Modal isOpen={isOpen} className="view-free-spin-modal" toggle={onCloseModal}>
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.TITLE')}
        </ModalHeader>
        <ModalBody>
          <ViewModalMain freeSpin={freeSpinData} />
          <hr />
          <ViewModalAdditional
            freeSpin={freeSpinData}
            rates={rates}
          />
          <ViewModalStatistics freeSpin={freeSpinData} />
          {this.renderNote(freeSpinData)}
        </ModalBody>
        <ModalFooter>
          <button
            onClick={onCloseModal}
            className="btn btn-default-outline"
          >
            {I18n.t('COMMON.CLOSE')}
          </button>

          {actions.map(action => (
            <button key={action.children} {...action} />
          ))}
        </ModalFooter>
      </Modal>
    );
  }
}

export default ViewModal;
