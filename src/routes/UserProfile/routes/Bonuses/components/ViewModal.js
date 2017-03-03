import React, { Component, PropTypes } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classNames from 'classnames';
import './ViewModal.scss';
import { shortify } from 'utils/uuid';
import Amount from 'components/Amount';
import moment from 'moment';
import { statusColorNames } from 'constants/user';
import BonusType from './BonusType';
import BonusStatus from './BonusStatus';

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
    return <div className="row margin-10 well player-header-blocks">
      <div className="col-md-3">
        <p className="color-default text-uppercase">
          Granted
        </p>

        {this.renderGrantedAmount(data)}
      </div>
      <div className="col-md-3">
        <p className="color-default text-uppercase">
          Wagered
        </p>

        {this.renderWageredAmount(data)}
      </div>
      <div className="col-md-3">
        <p className="color-default text-uppercase">
          To wager
        </p>

        {this.renderToWagerAmount(data)}
      </div>
      <div className="col-md-3">
        <p className="color-default text-uppercase">
          Total to wager
        </p>

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
        <p className="color-default text-uppercase">
          Bonus
        </p>

        {this.renderMainInfo(item)}
      </div>
      <div className="col-md-3">
        <p className="color-default text-uppercase">
          Available
        </p>

        {this.renderAvailablePeriod(item)}
      </div>
      <div className="col-md-2">
        <p className="color-default text-uppercase">
          Priority
        </p>

        {this.renderPriority(item)}
      </div>
      <BonusType className="col-md-2" bonus={item} label="Bonus type"/>
      <BonusStatus className="col-md-2" bonus={item} label="Status"/>
    </div>;
  };

  renderMainInfo = (data) => {
    return <span>
      <span className="font-weight-600">{data.label}</span><br />
      <small className="text-muted">{shortify(data.bonusUUID, 'BM')}</small>
      <br/>
      {
        !!data.campaignUUID &&
        <small className="text-muted">
          by Campaign {shortify(data.campaignUUID, 'CO')}
        </small>
      }
      {
        !data.campaignUUID && !!data.operatorUUID &&
        <small className="text-muted">
          by Manual Bonus {shortify(data.operatorUUID, 'OP')}
        </small>
      }
    </span>;
  };

  renderAvailablePeriod = (data) => {
    return data.createdDate ? <div>
      <span className="font-weight-600">
        {moment(data.createdDate).format('DD.MM.YYYY HH:mm:ss')}
        </span>
      <br/>
      {
        !!data.expirationDate &&
        <small>
          {moment(data.expirationDate).format('DD.MM.YYYY HH:mm:ss')}
        </small>
      }
    </div> : <span>&mdash</span>;
  };

  renderPriority = (data) => {
    return <span>{data.priority}</span>;
  };

  renderPlayer = (profile, balances) => {
    return <div className="row player-header-blocks margin-bottom-10">
      <div className="col-sm-4">
        <p className="color-default text-uppercase">
          Player
        </p>

        {this.renderPlayerInfo(profile)}
      </div>
      <div className="col-sm-4">
        <p className="color-default text-uppercase">
          Account status
        </p>

        {this.renderPlayerStatus(profile)}
      </div>
      <div className="col-sm-4">
        <p className="color-default text-uppercase">
          Balance
        </p>

        {this.renderBalance(balances)}
      </div>
    </div>;
  };

  /**
   * @todo Move to component
   */
  renderPlayerInfo = (profile) => {
    return <span>
      <span
        className="font-weight-600 text-capitalize font-size-12">
        {[profile.firstName, profile.lastName].join(' ')}
      </span>
      {' '}
      {!!profile.birthDate && <span>({moment().diff(profile.birthDate, 'years')})</span>}
      <br/>
      <span className="font-size-10">{profile.username} - {shortify(profile.uuid, 'PL')}</span>
    </span>;
  };

  /**
   * @todo Move to component
   */
  renderPlayerStatus = (profile) => {
    return <span>
      <span
        className={`font-weight-600 text-uppercase ${statusColorNames[profile.profileStatus]}`}
      >
        {profile.profileStatus}
        </span>
      <br/>
      {
        !!profile.suspendEndDate &&
        <span className="color-default font-size-10">
          Until {moment(profile.suspendEndDate).format('L')}
        </span>
      }
    </span>;
  };

  /**
   * @todo Move to component
   */
  renderBalance = ({ total, bonus, real }) => {
    return <span>
      <Amount className={'font-weight-600 text-uppercase'} {...total} /><br/>
      <span className="font-size-10">
        RM <Amount { ...real } /> + BM <Amount { ...bonus } />
      </span>
    </span>;
  };
}

export default ViewModal;
