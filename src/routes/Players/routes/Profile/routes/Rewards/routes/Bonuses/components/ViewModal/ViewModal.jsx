import React, { Component, Fragment } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import Amount from '../../../../../../../../../../components/Amount';
import BonusStatus from '../BonusStatus';
import ModalPlayerInfo from '../../../../../../../../../../components/ModalPlayerInfo';
import NoteButton from '../../../../../../../../../../components/NoteButton';
import { targetTypes } from '../../../../../../../../../../constants/note';
import Uuid from '../../../../../../../../../../components/Uuid';
import './ViewModal.scss';

class ViewModal extends Component {
  static propTypes = {
    playerProfile: PropTypes.userProfile.isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.any.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string.isRequired,
    })).isRequired,
    item: PropTypes.bonusEntity.isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
  };
  static defaultProps = {
    isOpen: false,
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
      this.context.onAddNoteClick(data.bonusUUID, targetTypes.BONUS)(target, { placement: 'top' });
    }
  };

  renderBonusStats = data => (
    <div className="row view-modal__bonus-stats">
      <div className="col">
        <div className="modal-tab-label">
          {I18n.t('PLAYER_PROFILE.BONUS.MODAL_VIEW.BONUS_STATS.GRANTED')}
        </div>
        {this.renderGrantedAmount(data)}
      </div>
      <div className="col">
        <div className="modal-tab-label">
          {I18n.t('PLAYER_PROFILE.BONUS.MODAL_VIEW.BONUS_STATS.WAGERED')}
        </div>
        {this.renderWageredAmount(data)}
      </div>
      <div className="col">
        <div className="modal-tab-label">
          {I18n.t('PLAYER_PROFILE.BONUS.MODAL_VIEW.BONUS_STATS.TO_WAGER')}
        </div>
        {this.renderToWagerAmount(data)}
      </div>
      <div className="col">
        <div className="modal-tab-label">
          {I18n.t('PLAYER_PROFILE.BONUS.MODAL_VIEW.BONUS_STATS.TOTAL_TO_WAGER')}
        </div>
        {this.renderTotalToWagerAmount(data)}
      </div>
    </div>
  );

  renderGrantedAmount = data => (
    <Amount
      className="modal-footer-tabs__amount"
      {...data.grantedAmount}
    />
  );

  renderWageredAmount = data => <Amount className="modal-footer-tabs__amount" {...data.wagered} />;

  renderToWagerAmount = (data) => {
    const toWagerAmount = {
      amount: Math.max(
        data.amountToWage && !isNaN(data.amountToWage.amount) &&
        data.wagered && !isNaN(data.wagered.amount)
          ? data.amountToWage.amount - data.wagered.amount : 0,
        0,
      ),
      currency: data.currency,
    };

    return <Amount className="modal-footer-tabs__amount" {...toWagerAmount} />;
  };

  renderTotalToWagerAmount = data => (
    <Amount className="modal-footer-tabs__amount" {...data.amountToWage} />
  );

  renderBonus = item => (
    <Fragment>
      <div className="form-row view-modal__body">
        <div className="col-6">
          <div className="modal-tab-label">
            {I18n.t('PLAYER_PROFILE.BONUS.MODAL_VIEW.BONUS_INFO.BONUS')}
          </div>
          {this.renderMainInfo(item)}
        </div>
        <div className="col">
          <div className="modal-tab-label">
            {I18n.t('PLAYER_PROFILE.BONUS.MODAL_VIEW.BONUS_INFO.AVAILABLE')}
          </div>
          {this.renderAvailablePeriod(item)}
        </div>
        <BonusStatus
          id="bonus-view-modal"
          className="col"
          bonus={item}
          label={I18n.t('PLAYER_PROFILE.BONUS.MODAL_VIEW.BONUS_INFO.STATUS')}
        />
      </div>
      <div className="form-row mb-3">
        <If condition={item.capping && item.prize}>
          <div className="col-4">
            <div className="modal-tab-label">
              {I18n.t('PLAYER_PROFILE.BONUS.MODAL_VIEW.BONUS_INFO.PRIZE_CAPPING')}
            </div>
            <div className="modal-header-tabs__label">
              <Amount {...item.capping} />
              <span className="mx-1">/</span>
              <Amount {...item.prize} />
            </div>
          </div>
        </If>
        <div className="col-4">
          <div className="modal-tab-label">
            {I18n.t('PLAYER_PROFILE.BONUS.MODAL_VIEW.BONUS_INFO.CLAIMABLE')}
          </div>
          <div className="modal-header-tabs__label">
            <Choose>
              <When condition={item.claimable}>
                {I18n.t('COMMON.YES')}
              </When>
              <Otherwise>
                {I18n.t('COMMON.NO')}
              </Otherwise>
            </Choose>
          </div>
        </div>
        <If condition={item.maxBet}>
          <div className="col-4">
            <div className="modal-tab-label">
              {I18n.t('PLAYER_PROFILE.BONUS.MODAL_VIEW.BONUS_INFO.MAX_BET')}
            </div>
            <div className="modal-header-tabs__label">
              {item.maxBet}
            </div>
          </div>
        </If>
      </div>
    </Fragment>
  );

  renderMainInfo = data => (
    <Fragment>
      <div className="modal-header-tabs__label">
        {data.label}
      </div>
      <Uuid uuid={data.bonusUUID} className="d-block font-size-11" />
      <div className="font-size-11">
        {I18n.t('COMMON.AUTHOR_BY')}
        <Choose>
          <When condition={data.campaignUUID}>
            <Uuid uuid={data.campaignUUID} uuidPrefix="CA" />
          </When>
          <When condition={!data.campaignUUID && data.operatorUUID}>
            <Uuid uuid={data.operatorUUID} uuidPrefix="OP" />
          </When>
        </Choose>
      </div>
    </Fragment>
  );

  renderAvailablePeriod = data => (
    <Choose>
      <When condition={data.createdDate}>
        <div className="modal-header-tabs__label">
          {moment.utc(data.createdDate).local().format('DD.MM.YYYY HH:mm')}
        </div>
        <If condition={!!data.expirationDate}>
          <div className="font-size-11">
            {`${I18n.t('COMMON.TO')} ${moment.utc(data.expirationDate).local().format('DD.MM.YYYY HH:mm')}`}
          </div>
        </If>
      </When>
      <Otherwise>
        <div className="font-weight-700">
          &mdash;
        </div>
      </Otherwise>
    </Choose>
  );

  renderNote = data => (
    <div className="text-center">
      <NoteButton
        id="free-spin-detail-modal-note"
        note={data.note}
        onClick={this.handleNoteClick}
        targetEntity={data}
        preview
      />
    </div>
  );

  render() {
    const { item, playerProfile, actions, onClose, ...rest } = this.props;
    const [leftSideAction, ...rightSideActions] = actions;

    return (
      <Modal className="bonus-details-modal" toggle={onClose} {...rest}>
        <ModalHeader toggle={onClose}>
          {I18n.t('PLAYER_PROFILE.BONUS.MODAL_VIEW.TITLE')}
        </ModalHeader>
        <ModalBody className="py-3">
          <ModalPlayerInfo playerProfile={playerProfile} />
          {this.renderBonus(item)}
          {this.renderBonusStats(item)}
          {this.renderNote(item)}
        </ModalBody>
        <If condition={actions.length > 0}>
          <ModalFooter>
            <If condition={leftSideAction}>
              <button {...leftSideAction} className={classNames(leftSideAction.className, 'mr-auto')} />
            </If>
            {rightSideActions.map(action => (
              <button key={action.children} {...action} />
            ))}
          </ModalFooter>
        </If>
      </Modal>
    );
  }
}

export default ViewModal;
