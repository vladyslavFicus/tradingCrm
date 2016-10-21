import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { stopEvent } from 'utils/helpers';

const APPROVAL_TYPE_APPROVE = 'approve';
const APPROVAL_TYPE_REJECT = 'reject';

const initialState = {
  reasonMessage: '',
};

class ApprovalState extends Component {
  constructor(props) {
    super(props);

    this.state = { ...initialState };

    this.handleRejectReason = this.handleRejectReason.bind(this);
    this.handleApprovalClick = this.handleApprovalClick.bind(this);
  };

  handleRejectReason(e) {
    this.setState({
      reasonMessage: e.target.value,
    });
  }

  handleApprovalClick(type) {
    const { approveProfile, rejectProfile, profileData: { userId, uuid } } = this.props;
    if (type === APPROVAL_TYPE_APPROVE) {
      approveProfile(userId, uuid);
    } else if (type === APPROVAL_TYPE_REJECT) {
      rejectProfile(userId, uuid, this.state.reasonMessage);
    }
  }

  render() {
    if (this.props.profileData.state !== 'IN_REVIEW') return null;

    return (
      <div>
        <h4>KYC</h4>
        <div className="form-group row">
          <label className="col-sm-1 col-form-label text-right">Accept</label>
          <div className="col-sm-4">
            <div className={classNames('form-group')}>
              <div className="input-group">
                <div className="input-group-btn">
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      this.handleApprovalClick(APPROVAL_TYPE_APPROVE);
                    }}
                  >Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-1 col-form-label text-right">Reject</label>
          <div className="col-sm-4">
            <div className={classNames('form-group')}>
              <div className="input-group">
                <input
                  ref="rejectReason"
                  type="text"
                  onChange={this.handleRejectReason}
                  className={classNames('form-control')}
                />
                <div className="input-group-btn">
                  <button
                    disabled={!this.state.reasonMessage.length > 0}
                    className="btn btn-danger"
                    onClick={() => {
                      this.handleApprovalClick(APPROVAL_TYPE_REJECT);
                    }}
                  >Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default ApprovalState;

ApprovalState.propTypes = {
  profileData: PropTypes.object.isRequired,
  approveProfile: PropTypes.func.isRequired,
  rejectProfile: PropTypes.func.isRequired,
};

ApprovalState.defaultProps = {
  profileData: [],
};
