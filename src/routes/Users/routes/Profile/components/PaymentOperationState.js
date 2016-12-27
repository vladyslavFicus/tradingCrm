import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { stopEvent } from 'utils/helpers';

const initialState = {
  reasonMessage: '',
  reasonMessageError: '',
};

class PaymentOperationState extends Component {
  constructor(props) {
    super(props);

    this.state = { ...initialState };

    this.handleChangeReasonMessage = this.handleChangeReasonMessage.bind(this);
    this.handleLockClick = this.handleLockClick.bind(this);
    this.handleUnlockClick = this.handleUnlockClick.bind(this);
  }

  handleChangeReasonMessage(e) {
    const target = e.target;

    if (target.value) {
      this.setState({ reasonMessage: target.value });
    }
  }

  handleLockClick(e) {
    stopEvent(e);
    const { reasonMessage } = this.state;

    if (reasonMessage === '') {
      this.setState({ reasonMessageError: 'Reason cannot be empty!' });
    } else {
      this.props.onLock(reasonMessage);
      this.setState({ ...initialState });
    }
  }

  handleUnlockClick(e) {
    stopEvent(e);

    this.props.onUnlock();
  }

  renderLockForm() {
    return <div className={classNames('form-group', { 'has-danger': !!this.state.reasonMessageError })}>
      <div className="input-group">
        <input
          type="text"
          onChange={this.handleChangeReasonMessage}
          className={classNames('form-control', { 'form-control-danger': !!this.state.reasonMessageError })}
        />
        <div className="input-group-btn">
          <button
            className="btn btn-success"
            onClick={this.handleLockClick}
          >Lock
          </button>
        </div>
      </div>
      {!!this.state.reasonMessageError && <div className="form-control-feedback">{this.state.reasonMessageError}</div>}
    </div>;
  }

  renderReasons(reasons) {
    const { hasAccessByUuid } = this.props;

    return <ul>
      {reasons.map((item, key) => <li key={key}>{item.reason}
        &nbsp;
        <small>({moment(item.startLock).format('YYYY.MM.DD HH:mm:ss')})</small>
        &nbsp;
        {hasAccessByUuid(item.author) && <button
          className="btn btn-xs btn-danger"
          onClick={this.handleUnlockClick}
        ><i className="fa fa-unlock"/>
        </button>}
      </li>)}
    </ul>;
  }

  render() {
    const { name, reasons } = this.props;

    return name !== undefined ? <div className="form-group row">
        <label className="col-sm-1 col-form-label text-right">{name}</label>
        <div className="col-sm-4">
          {reasons.length > 0 ? this.renderReasons(reasons) : this.renderLockForm()}
        </div>
      </div> : null;
  }
}

PaymentOperationState.propTypes = {
  name: PropTypes.string.isRequired,
  reasons: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    reason: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    startLock: PropTypes.string.isRequired,
    playerUUID: PropTypes.string.isRequired,
  })),
  onLock: PropTypes.func.isRequired,
  onUnlock: PropTypes.func.isRequired,
};

PaymentOperationState.defaultProps = {
  reasons: [],
};

export default PaymentOperationState;
