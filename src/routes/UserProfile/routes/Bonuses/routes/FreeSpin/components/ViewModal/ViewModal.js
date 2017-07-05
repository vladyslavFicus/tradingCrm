import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import { targetTypes } from '../../../../../../../../constants/note';
import FreeSpinMainInfo from '../FreeSpinMainInfo';
import FreeSpinGameInfo from '../FreeSpinGameInfo';
import FreeSpinAvailablePeriod from '../FreeSpinAvailablePeriod';
import FreeSpinSettings from '../FreeSpinSettings';
import FreeSpinStatus from '../../../../../../../../components/FreeSpinStatus';
import NoteButton from '../../../../../../../../components/NoteButton';
import './ViewModal.scss';
import Amount from '../../../../../../../../components/Amount';
import BonusSettings from '../BonusSettings';

class ViewModal extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.any.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string.isRequired,
    })).isRequired,
    item: PropTypes.freeSpinEntity.isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.onEditNoteClick(target, note, { placement: 'top' });
    } else {
      this.context.onAddNoteClick(data.uuid, targetTypes.FREE_SPIN)(target, { placement: 'top' });
    }
  };

  renderMain = item => (
    <div className="row player-header-blocks margin-bottom-20">
      <div className="col-md-6">
        <div className="color-default text-uppercase font-size-11">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.FREE_SPIN')}
        </div>

        <FreeSpinMainInfo freeSpin={item} />
      </div>
      <div className="col-md-3">
        <div className="color-default text-uppercase font-size-11">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.PROVIDER_AND_GAME')}
        </div>

        <FreeSpinGameInfo freeSpin={item} />
      </div>
      <div className="col-md-3">
        <div className="color-default text-uppercase font-size-11">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATUS')}
        </div>

        <FreeSpinStatus freeSpin={item} />
      </div>
    </div>
  );

  renderAdditional = item => (
    <div className="row player-header-blocks margin-bottom-20">
      <div className="col-md-4">
        <div className="color-default text-uppercase font-size-11">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.AVAILABLE')}
        </div>

        <FreeSpinAvailablePeriod freeSpin={item} />
      </div>
      <div className="col-md-4">
        <div className="color-default text-uppercase font-size-11">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.SPIN_SETTINGS')}
        </div>

        <FreeSpinSettings freeSpin={item} />
      </div>
      <div className="col-md-4">
        <div className="color-default text-uppercase font-size-11">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.BONUS_SETTINGS')}
        </div>

        <BonusSettings freeSpin={item} />
      </div>
    </div>
  );

  renderStatistics = data => (
    <div className="row well player-header-blocks">
      <div className="col-md-3 grey-back-tab">
        <div className="color-default text-uppercase font-size-11">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_GRANTED_TITLE')}
        </div>

        <span className="font-weight-600 font-size-20 color-primary">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_GRANTED_COUNT', { count: data.freeSpinsAmount })}
        </span>
      </div>
      <div className="col-md-3 grey-back-tab">
        <div className="color-default text-uppercase font-size-11">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_TOTAL_VALUE_TITLE')}
        </div>

        <Amount className="font-weight-600 font-size-20 color-primary" {...data.totalValue} />
      </div>
      <div className="col-md-3 grey-back-tab">
        <div className="color-default text-uppercase font-size-11">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_PLAYED_TITLE')}
        </div>

        <span className="font-weight-600 font-size-20 color-primary">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_PLAYED_COUNT', { count: data.freeSpinsAmount })}
        </span>
      </div>
      <div className="col-md-3 grey-back-tab">
        <div className="color-default text-uppercase font-size-11">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_WINNINGS_TITLE')}
        </div>

        <Amount className="font-weight-600 font-size-20 color-primary" {...data.totalValue} />
      </div>
    </div>
  );

  renderNote = data => (
    <div className="row margin-top-20">
      <div className="col-md-12 text-center">
        <NoteButton
          id="free-spin-detail-modal-note"
          note={data.note}
          onClick={this.handleNoteClick}
          targetEntity={data}
        />
      </div>
    </div>
  );

  render() {
    const { item, actions, onClose, ...rest } = this.props;

    return (
      <Modal className="view-free-spin-modal" toggle={onClose} {...rest}>
        <ModalHeader toggle={onClose}>
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.TITLE')}
        </ModalHeader>
        <ModalBody>
          {this.renderMain(item)}
          <hr />
          {this.renderAdditional(item)}
          {this.renderStatistics(item)}
          {this.renderNote(item)}
        </ModalBody>
        <ModalFooter>
          {
            actions.length <= 2 &&
            <div className="row">
              {actions.map((action, index) => (
                <div key={action.children} className={classNames('col-md-6', { 'text-right': index !== 0 })}>
                  <button {...action} />
                </div>
              ))}
            </div>
          }
        </ModalFooter>
      </Modal>
    );
  }
}

export default ViewModal;
