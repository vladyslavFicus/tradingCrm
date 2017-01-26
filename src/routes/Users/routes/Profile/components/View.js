import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import Amount from 'components/Amount';
import PaymentOperationState from './PaymentOperationState';
import moment from 'moment';
import { statesLabels } from 'routes/Users/constants';
import { startCase } from 'lodash';

const config = { tabName: 'profile' };

class View extends Component {
  componentWillMount() {
    const { profile, loadFullProfile, params } = this.props;

    if ((!profile.receivedAt || params.id !== profile.data.uiid) && !profile.isLoading) {
      loadFullProfile(params.id);
    }
  }

  handleCancelBonus = (id) => {
    this.props.cancelBonus(id, this.props.params.id)
      .then(() => this.props.fetchActiveBonus(this.props.params.id));
  };

  handleLock = (operation, reason) => {
    if (operation === 'deposit') {
      this.props.lockDeposit(this.props.params.id, reason);
    } else if (operation === 'withdraw') {
      this.props.lockWithdraw(this.props.params.id, reason);
    }
  };

  handleUnlock = (operation) => {
    if (operation === 'deposit') {
      this.props.unlockDeposit(this.props.params.id);
    } else if (operation === 'withdraw') {
      this.props.unlockWithdraw(this.props.params.id);
    }
  };

  hasAccessByUuid = (uuid) => {
    return this.props.user.uuid === uuid;
  };

  renderUserData() {
    const { profile: { data } } = this.props;
    const simpleFields = ['uuid', 'email', 'username', 'address', 'country', 'firstName', 'lastName'];

    const simpleRow =  Object
      .keys(data)
      .filter(value => simpleFields.includes(value))
      .filter(value => data[value] !== null)
      .map((key, id) => (
          <div key={id} className="form-group row">
            <label className="col-sm-1 col-form-label text-right"> { startCase(key) } </label>
            <div className="col-sm-10">
              {data[key]}
            </div>
          </div>
        )
      );

    return (
      <div>
        { simpleRow }
        <div className="form-group row">
          <label className="col-sm-1 col-form-label text-right">Birth Date</label>
          <div className="col-sm-10">
            { moment(data.birthDate).format('DD.MM.YYYY HH:mm:ss') }
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-1 col-form-label text-right">Creation Date</label>
          <div className="col-sm-10">
            { moment(data.creationDate).format('DD.MM.YYYY HH:mm:ss') }
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-1 col-form-label text-right">State</label>
          <div className="col-sm-10">
            { statesLabels[data.state] }
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-1 col-form-label text-right">Verified</label>
          <div className="col-sm-10">
            <span className={
              classNames('donut', data.verified ? 'donut-success' : 'donut-danger')
            } />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { profile, deposit, withdraw, bonus } = this.props;

    return <div id={`tab-${config.tabName}`} className={classNames('tab-pane fade in active')}>

      { this.renderUserData() }

      <div className="form-group row">
        <label className="col-sm-1 col-form-label text-right">Balance</label>
        <div className="col-sm-10">
          <Amount {...profile.data.balance} />
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
    </div>;
  }
}

export default View;
