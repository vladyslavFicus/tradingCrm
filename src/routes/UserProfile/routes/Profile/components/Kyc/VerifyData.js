import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from '../../../../../../constants/propTypes';
import { statuses as kysStatuses } from '../../../../../../constants/kyc';
import { shortify } from '../../../../../../utils/uuid';

class VerifyData extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.status.isRequired,
    onVerify: PropTypes.func.isRequired,
    onRefuse: PropTypes.func.isRequired,
  };

  render() {
    const { title, description, status, onVerify, onRefuse } = this.props;

    return (
      <div>
        {
          status.value !== kysStatuses.VERIFIED &&
          <div>
            <div className="h5 color-warning">
              <i className="fa fa-exclamation-triangle" /> {title} not verified
            </div>
            <div className="padding-bottom-20">
              {description}
            </div>

            <div>
              <button
                onClick={onRefuse}
                type="button"
                className="btn btn-danger-outline margin-inline"
              >
                Refuse
              </button>
              <button
                onClick={onVerify}
                type="button"
                className="btn btn-success-outline margin-inline"
              >
                Verify {title.toLowerCase()}
              </button>
            </div>
          </div>
        }

        {
          status.value === kysStatuses.VERIFIED &&
          <div>
            <div className="row margin-bottom-50">
              <div className="col-md-12">
                <div className="h5 color-success">
                  <i className="fa fa-check-circle-o" /> {title} verified
                </div>
                <div className="font-size-12 color-default font-weight-500">
                  by {shortify(status.author)} on {moment(status.editDate).format('DD.MM.YYYY \\a\\t HH:mm:ss')}
                </div>
              </div>
            </div>

            <div className="row margin-top-50">
              <div className="col-md-12 text-right">
                <button
                  onClick={onRefuse}
                  type="button"
                  className="btn btn-danger-outline margin-inline"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default VerifyData;
