import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classNames from 'classnames';
import moment from 'moment';
import './ViewModal.scss';
import { shortify } from '../../../../../../../../utils/uuid';
import Amount from '../../../../../../../../components/Amount';
import BonusType from '../BonusType';
import BonusStatus from '../BonusStatus';
import ModalPlayerInfo from '../../../../../../../../components/ModalPlayerInfo';

class ViewModal extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    accumulatedBalances: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    item: PropTypes.bonusEntity.isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
  };

  renderBonusStats = data => <div className="row well player-header-blocks">
    <div className="col-md-3 grey-back-tab">
      <div className="color-default text-uppercase font-size-11">
        Granted
      </div>

      {this.renderGrantedAmount(data)}
    </div>
    <div className="col-md-3 grey-back-tab">
      <div className="color-default text-uppercase font-size-11">
        Wagered
      </div>

      {this.renderWageredAmount(data)}
    </div>
    <div className="col-md-3 grey-back-tab">
      <div className="color-default text-uppercase font-size-11">
        To wager
      </div>

      {this.renderToWagerAmount(data)}
    </div>
    <div className="col-md-3 grey-back-tab">
      <div className="color-default text-uppercase font-size-11">
        Total to wager
      </div>

      {this.renderTotalToWagerAmount(data)}
    </div>
  </div>;

  renderGrantedAmount = data => <Amount
    className="font-weight-600 font-size-20 color-primary" {...data.grantedAmount}
  />;

  renderWageredAmount = data => <Amount className="font-weight-600 font-size-20 color-primary" {...data.wagered} />;

  renderToWagerAmount = (data) => {
    const toWagerAmount = {
      amount: Math.max(
        data.amountToWage && !isNaN(data.amountToWage.amount) &&
        data.wagered && !isNaN(data.wagered.amount)
          ? data.amountToWage.amount - data.wagered.amount : 0,
        0
      ),
      currency: data.currency,
    };

    return <Amount className="font-weight-600 font-size-20 color-primary" {...toWagerAmount} />;
  };

  renderTotalToWagerAmount = data => (
    <Amount className="font-weight-600 font-size-20 color-primary" {...data.amountToWage} />
  );

  renderBonus = item => <div className="row margin-vertical-20">
    <div className="col-md-3">
      <div className="color-default text-uppercase font-size-11">
        Bonus
      </div>

      {this.renderMainInfo(item)}
    </div>
    <div className="col-md-3">
      <div className="color-default text-uppercase font-size-11">
        Available
      </div>

      {this.renderAvailablePeriod(item)}
    </div>
    <div className="col-md-2">
      <div className="color-default text-uppercase font-size-11">
        Priority
      </div>

      {this.renderPriority(item)}
    </div>
    <BonusType className="col-md-2" bonus={item} label="Bonus type" />
    <BonusStatus className="col-md-2" bonus={item} label="Status" />
  </div>;

  renderMainInfo = data => <span>
    <div className="font-weight-600">{data.label}</div>
    <div className="little-grey-text font-size-11">{shortify(data.bonusUUID)}</div>
    {
      !!data.campaignUUID &&
      <div className="little-grey-text font-size-11">
        by Campaign {shortify(data.campaignUUID, 'CA')}
      </div>
    }
    {
      !data.campaignUUID && !!data.operatorUUID &&
      <div className="ittle-grey-text font-size-11">
        by Manual Bonus {shortify(data.operatorUUID, 'OP')}
      </div>
    }
  </span>;

  renderAvailablePeriod = (data) => data.createdDate ? <div>
    <div className="font-weight-600">
      {moment(data.createdDate).format('DD.MM.YYYY HH:mm:ss')}
    </div>
    {
      !!data.expirationDate &&
      <div className="little-grey-text font-size-11">
        {moment(data.expirationDate).format('DD.MM.YYYY HH:mm:ss')}
      </div>
    }
  </div> : <span>&mdash</span>;

  renderPriority = data => <span>{data.priority}</span>;

  render() {
    const { item, profile, actions, accumulatedBalances, onClose, ...rest } = this.props;

    return (
      <Modal className="view-bonus-modal" toggle={onClose} {...rest}>
        <ModalHeader toggle={onClose}>Bonus details</ModalHeader>
        <ModalBody>
          <ModalPlayerInfo
            profile={profile.data}
            balances={accumulatedBalances}
          />
          <hr />
          {this.renderBonus(item)}
          {this.renderBonusStats(item)}
        </ModalBody>
        <ModalFooter>
          {
            actions.length === 2 &&
            <div className="row">
              {actions.map((action, index) => (
                <div key={index} className={classNames('col-md-6', { 'text-right': index !== 0 })}>
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
