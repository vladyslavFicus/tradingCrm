import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import PaymentOperationState from './PaymentOperationState';
import ApprovalState from './ApprovalState';

const config = { tabName: 'profile' };

class View extends Component {
  constructor(props) {
    super(props);

    this.hasAccessByUuid = this.hasAccessByUuid.bind(this);
    this.handleCancelBonus = this.handleCancelBonus.bind(this);
  }

  componentWillMount() {
    const { profile, loadFullProfile, params } = this.props;

    if ((!profile.receivedAt || params.id !== profile.data.uiid) && !profile.isLoading) {
      loadFullProfile(params.id);
    }
  }

  handleCancelBonus(id) {
    this.props.cancelBonus(id, this.props.params.id)
      .then(() => this.props.fetchActiveBonus(this.props.params.id));
  }

  handleLock(operation, reason) {
    if (operation === 'deposit') {
      this.props.lockDeposit(this.props.params.id, reason);
    } else if (operation === 'withdraw') {
      this.props.lockWithdraw(this.props.params.id, reason);
    }
  }

  handleUnlock(operation) {
    if (operation === 'deposit') {
      this.props.unlockDeposit(this.props.params.id);
    } else if (operation === 'withdraw') {
      this.props.unlockWithdraw(this.props.params.id);
    }
  }

  hasAccessByUuid(uuid) {
    return this.props.user.uuid === uuid;
  }

  render() {
    const { profile, deposit, withdraw, bonus, } = this.props;

    return <div id={`tab-${config.tabName}`} className={classNames('tab-pane fade in active')}>
      <div className="form-group row">
        <label className="col-sm-1 col-form-label text-right">Username</label>
        <div className="col-sm-10">
          {profile.data.username}
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-1 col-form-label text-right">Email</label>
        <div className="col-sm-10">
          {profile.data.email}
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-1 col-form-label text-right">UUID</label>
        <div className="col-sm-10">
          {profile.data.uuid}
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-1 col-form-label text-right">Balance</label>
        <div className="col-sm-10">
          {!isNaN(parseFloat(profile.data.balance)) ?
            parseFloat(profile.data.balance).toFixed(2) : 0.00} {profile.data.currency}
        </div>
      </div>

      {!!bonus.data && <div className="form-group row">
        <label className="col-sm-1 col-form-label text-right">Bonus</label>
        <div className="col-sm-5">
          {bonus.data.label}, Converted: {bonus.data.converted || '0.00'}, Wagered: {bonus.data.wagered || '0.00'}&nbsp;
          <button
            className="btn btn-xs btn-danger"
            onClick={() => {
              this.handleCancelBonus(bonus.data.id);
            }}
          ><i className="fa fa-times"/>
          </button>
        </div>
      </div>}

      <PaymentOperationState
        name={'Deposit lock'}
        {...deposit}
        hasAccessByUuid={this.hasAccessByUuid}
        onLock={this.handleLock.bind(this, 'deposit')}
        onUnlock={this.handleUnlock.bind(this, 'deposit')}
      />

      <PaymentOperationState
        name={'Withdraw lock'}
        {...withdraw}
        hasAccessByUuid={this.hasAccessByUuid}
        onLock={this.handleLock.bind(this, 'withdraw')}
        onUnlock={this.handleUnlock.bind(this, 'withdraw')}
      />

      <div className="form-group row">
        <div className="col-sm-10 col-sm-offset-1">
          <Link className="btn btn-primary" to={`/bonuses/create/${this.props.params.id}`}>
            Create bonus for user
          </Link>
        </div>
      </div>

      <ApprovalState
        profileData={{
          userId: profile.data.id,
          uuid: profile.data.uuid,
          state: profile.data.state,
        }}
        onApprove={ this.props.approveProfile }
        onReject={ this.props.rejectProfile }
      />

    </div>;
  }
}

export default View;
