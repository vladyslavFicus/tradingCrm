import React, { Component, PropTypes } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classNames from 'classnames';
import './ViewModal.scss';
import { shortify } from 'utils/uuid';
import Amount from 'components/Amount';
import moment from 'moment';
import { statuses as userStatuses } from 'config/user';
import {
  statuses,
  statusesLabels,
  statusesProps,
  typesLabels,
  typesProps,
} from 'constants/bonus';

// @todo Reuse this
const statusColorNames = {
  [userStatuses.ACTIVE]: 'color-success',
  [userStatuses.INACTIVE]: 'color-warning',
  [userStatuses.BLOCKED]: 'color-danger',
  [userStatuses.SUSPENDED]: 'color-secondary',
};

class ViewModal extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    const { item, profile, actions, accumulatedBalances, onClose, ...rest } = this.props;

    return (
      <Modal className="view-bonus-modal" toggle={onClose} {...rest}>
        <ModalHeader toggle={onClose}>Bonus details</ModalHeader>
        <ModalBody>
          {this.renderPlayer(profile.data, accumulatedBalances.data)}
          <hr />
          {this.renderBonus(item)}
          {this.renderBonusStats(item)}
        </ModalBody>
        <ModalFooter>
          {
            actions.length === 2 &&
            <div className="row">
              {actions.map((action, index) => (
                <div className={classNames("col-md-6", { 'text-right': index !== 0 })}>
                  <button {...action}/>
                </div>
              ))}
            </div>
          }
        </ModalFooter>
      </Modal>
    );
  }

  renderBonusStats = (data) => {
    return <div className="row well player-header-blocks">
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
  };

  renderGrantedAmount = (data) => {
    return <Amount className="font-weight-600 font-size-20 color-primary" {...data.grantedAmount}/>;
  };

  renderWageredAmount = (data) => {
    return <Amount className="font-weight-600 font-size-20 color-primary" {...data.wagered}/>;
  };

  renderToWagerAmount = (data) => {
    const toWagerAmount = {
      amount: Math.max(
        data.amountToWage && !isNaN(data.amountToWage.amount) &&
        data.wagered && !isNaN(data.wagered.amount)
          ? data.amountToWage.amount - data.wagered.amount : 0,
        0
      ), currency: data.currency
    };

    return <Amount className="font-weight-600 font-size-20 color-primary" {...toWagerAmount}/>;
  };

  renderTotalToWagerAmount = (data) => {
    return <Amount className="font-weight-600 font-size-20 color-primary" {...data.amountToWage}/>;
  };

  renderBonus = (item) => {
    return <div className="row margin-vertical-20">
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
      <div className="col-md-2">
        <div className="color-default text-uppercase font-size-11">
          Bonus type
        </div>

        {this.renderType(item)}
      </div>
      <div className="col-md-2">
        <div className="color-default text-uppercase font-size-11">
          Status
        </div>

        {this.renderStatus(item)}
      </div>
    </div>;
  };

  renderMainInfo = (data) => {
    return <span>
      <div className="font-weight-600">{data.label}</div>
      <div className="little-grey-text font-size-11">{shortify(data.bonusUUID, 'BM')}</div>
      {
        !!data.campaignUUID &&
        <div className="little-grey-text font-size-11">
          by Campaign {shortify(data.campaignUUID, 'CO')}
        </div>
      }
      {
        !data.campaignUUID && !!data.operatorUUID &&
        <div className="ittle-grey-text font-size-11">
          by Manual Bonus {shortify(data.operatorUUID, 'OP')}
        </div>
      }
    </span>;
  };

  renderAvailablePeriod = (data) => {
    return data.createdDate ? <div>
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
  };

  renderPriority = (data) => {
    return <span>{data.priority}</span>;
  };

  renderType = (data) => {
    if (!data.bonusType) {
      return data.bonusType;
    }

    const label = typesLabels[data.bonusType] || data.bonusType;
    const props = typesProps[data.bonusType] || {};

    return <div>
      <div {...props}>{label}</div>
      <div className="little-grey-text font-size-11">{
        data.optIn
          ? 'Opt-in'
          : 'Non Opt-in'
      }</div>
    </div>;
  };

  renderStatus = (data) => {
    if (!data.state) {
      return data.state;
    }

    const label = statusesLabels[data.state] || data.state;
    const props = statusesProps[data.state] || {};

    return <div>
      <span {...props}>{label}</span><br/>
      {data.state === statuses.IN_PROGRESS && this.renderStatusActive(data)}
    </div>;
  };

  renderStatusActive = (data) => {
    return data.expirationDate
      ? <small>Until {moment(data.expirationDate).format('DD.MM.YYYY')}</small>
      : null;
  };

  renderPlayer = (profile, balances) => {
    return <div className="row player-header-blocks margin-bottom-10 equal">
      <div className="col-sm-4 equal-in">
        <div className="color-default text-uppercase font-size-11">
          Player
        </div>

        {this.renderPlayerInfo(profile)}
      </div>
      <div className="col-sm-4 equal-in">
        <div className="color-default text-uppercase font-size-11">
          Account status
        </div>

        {this.renderPlayerStatus(profile)}
      </div>
      <div className="col-sm-4 equal-in">
        <div className="color-default text-uppercase font-size-11">
          Balance
        </div>

        {this.renderBalance(balances)}
      </div>
    </div>;
  };

  renderPlayerInfo = (profile) => {
    return <div className="line-height-1">
      <span
        className="font-weight-600 text-capitalize font-size-14">
        {[profile.firstName, profile.lastName].join(' ')}
      </span>
      {' '}
      {!!profile.birthDate && <span>({moment().diff(profile.birthDate, 'years')})</span>}
      <br/>
      <span className="little-grey-text font-size-11">{profile.username} - {shortify(profile.uuid, 'PL')}</span>
    </div>;
  };

  renderPlayerStatus = (profile) => {
    return <div>
      <div
        className={`font-weight-600 text-uppercase ${statusColorNames[profile.profileStatus]}`}
      >
        {profile.profileStatus}
        </div>
      {
        !!profile.suspendEndDate &&
        <div className="color-default font-size-11">
          Until {moment(profile.suspendEndDate).format('L')}
        </div>
      }
    </div>;
  };

  renderBalance = ({ total, bonus, real }) => {
    return <div>
      <Amount tag="div" className={'font-weight-600 text-uppercase'} {...total} />
      <div className="little-grey-text font-size-11">
        RM <Amount { ...real } /> + BM <Amount { ...bonus } />
      </div>
    </div>;
  };
}

export default ViewModal;
