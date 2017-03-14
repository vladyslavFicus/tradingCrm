import React, { Component, PropTypes } from 'react';
import { statuses as kysStatuses } from 'constants/kyc';

class KycVerify extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onStatusChange: PropTypes.func.isRequired,
  };

  render() {
    const { status } = this.props;

    return (
      <div>

        {
          status !== kysStatuses.VERIFY &&
            <div>
              <button type="button" className="btn btn-danger-outline margin-inline">Refuse</button>
              <button type="button" className="btn btn-success-outline margin-inline">Verify identity</button>
            </div>
        }

        {
          status === kysStatuses.VERIFY &&
          <div>
            <button type="button" className="btn btn-danger-outline margin-inline">Revoke</button>
          </div>
        }
      </div>
    );
  }
}

export default KycVerify;
