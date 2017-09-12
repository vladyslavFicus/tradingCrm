import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import PropTypes from '../../../../../../../../constants/propTypes';
import { shortify } from '../../../../../../../../utils/uuid';
import Amount from '../../../../../../../../components/Amount';
import BonusType from '../BonusType';
import BonusStatus from '../BonusStatus';
import ModalPlayerInfo from '../../../../../../../../components/ModalPlayerInfo';
import NoteButton from '../../../../../../../../components/NoteButton';
import { targetTypes } from '../../../../../../../../constants/note';

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
    <div className="modal-footer-tabs modal-footer-tabs_justified-around">
      <div className="modal-footer-tabs__item">
        <div className="modal-tab-label">
          Granted
        </div>

        {this.renderGrantedAmount(data)}
      </div>
      <div className="modal-footer-tabs__item">
        <div className="modal-tab-label">
          Wagered
        </div>

        {this.renderWageredAmount(data)}
      </div>
      <div className="modal-footer-tabs__item">
        <div className="modal-tab-label">
          To wager
        </div>

        {this.renderToWagerAmount(data)}
      </div>
      <div className="modal-footer-tabs__item">
        <div className="modal-tab-label">
          Total to wager
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
    <div className="modal-body-tabs">
      <div className="modal-body-tabs__item">
        <div className="modal-tab-label">
          Bonus
        </div>

        {this.renderMainInfo(item)}
      </div>
      <div className="modal-body-tabs__item">
        <div className="modal-tab-label">
          Available
        </div>

        {this.renderAvailablePeriod(item)}
      </div>
      <div className="modal-body-tabs__item">
        <div className="modal-tab-label">
          Priority
        </div>

        {this.renderPriority(item)}
      </div>
      <BonusType className="modal-body-tabs__item" bonus={item} label="Bonus type" />
      <BonusStatus id="bonus-view-modal" className="modal-body-tabs__item" bonus={item} label="Status" />
    </div>
  );

  renderMainInfo = data => (
    <div>
      <div className="modal-header-tabs__label">
        {data.label}
      </div>

      <div className="font-size-11">{shortify(data.bonusUUID)}</div>
      {
        !!data.campaignUUID &&
        <div className="font-size-11">
          by Campaign {shortify(data.campaignUUID, 'CA')}
        </div>
      }
      {
        !data.campaignUUID && !!data.operatorUUID &&
        <div className="font-size-11">
          by Manual Bonus {shortify(data.operatorUUID, 'OP')}
        </div>
      }
    </div>
  );

  renderAvailablePeriod = data => (
    data.createdDate
      ? (
        <div>
          <div className="modal-header-tabs__label">
            {moment.utc(data.createdDate).local().format('DD.MM.YYYY HH:mm:ss')}
          </div>
          {
            !!data.expirationDate &&
            <div className="font-size-11">
              {moment.utc(data.expirationDate).local().format('DD.MM.YYYY HH:mm:ss')}
            </div>
          }
        </div>
      ) : <span>&mdash</span>
  );

  renderPriority = data => <div className="modal-header-tabs__label">{data.priority}</div>;

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
      <Modal className="view-bonus-modal" toggle={onClose} {...rest}>
        <ModalHeader toggle={onClose}>Bonus details</ModalHeader>
        <ModalBody>
          <ModalPlayerInfo playerProfile={playerProfile} />
          {this.renderBonus(item)}
          {this.renderBonusStats(item)}
          {this.renderNote(item)}
        </ModalBody>
        {
          actions.length > 0 &&
          <ModalFooter>
            <div className="row">
              <div className="col-md-6 text-left">
                {leftSideAction && <button {...leftSideAction} />}
              </div>
              <div className="col-md-6 text-right">
                {rightSideActions.map(action => (
                  <button key={action.children} {...action} />
                ))}
              </div>
            </div>
          </ModalFooter>
        }
      </Modal>
    );
  }
}

export default ViewModal;
