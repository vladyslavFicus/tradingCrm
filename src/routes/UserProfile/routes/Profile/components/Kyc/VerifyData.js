import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from '../../../../../../constants/propTypes';
import { statuses as kysStatuses } from '../../../../../../constants/kyc';
import Uuid from '../../../../../../components/Uuid';

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

    if (status.author === 'signUp' && status.value === kysStatuses.REFUSED) {
      return (
        <div>
          <div className="font-size-18 font-weight-700 color-warning">
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
      );
    }

    return (
      <div>
        {
          status.value !== kysStatuses.VERIFIED &&
          <div>
            <div className="margin-bottom-10">
              <div className="font-size-18 font-weight-700 color-danger">
                <i className="fa fa-exclamation-triangle" /> {title} verification rejected
              </div>
              <div className="font-size-11 color-default">
                by <Uuid uuid={status.author} /> on {moment(status.editDate).format('DD.MM.YYYY \\a\\t HH:mm:ss')}
              </div>
            </div>

            <div className="padding-bottom-20">
              <div className="font-weight-700">Reason:</div>
              <div className="font-italic font-size-12">{status.reason}</div>
            </div>

            <div className="margin-top-50 text-right">
              <button
                onClick={onVerify}
                type="button"
                className="btn btn-success-outline"
              >
                Verify {title.toLowerCase()}
              </button>
            </div>
          </div>
        }

        {
          status.value === kysStatuses.VERIFIED &&
          <div>
            <div className="margin-bottom-10">
              <div className="font-size-18 font-weight-700 color-success">
                <i className="fa fa-check-circle-o" /> {title} verified
              </div>
              <div className="font-size-11 color-default">
                by <Uuid uuid={status.author} /> on {moment(status.editDate).format('DD.MM.YYYY \\a\\t HH:mm:ss')}
              </div>
            </div>

            <div className="margin-top-50 text-right">
              <button
                onClick={onRefuse}
                type="button"
                className="btn btn-danger-outline"
              >
                Revoke
              </button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default VerifyData;
