import React from 'react';
import keyMirror from 'keymirror';
import PropTypes from '../../../../../../../constants/propTypes';
import { statuses as kysStatuses } from '../../../../../../../constants/kyc';
import NotRequested from './NotRequested';
import NotVerified from './NotVerified';
import Refused from './Refused';
import Verified from './Verified';

export const stepStatuses = keyMirror({
  NOT_REQUESTED: null,
  WAITING_FOR_DOCUMENTS: null,
  VERIFICATION_IS_PENDING: null,
  REFUSED: null,
  VERIFIED: null,
  UNKNOWN: null,
});

const VerifyData = (props) => {
  const { title, status } = props;

  switch (true) {
    case !status:
      return <NotRequested title={title} />;
    case status.status === kysStatuses.PENDING && !status.reason:
      return <NotVerified step={stepStatuses.WAITING_FOR_DOCUMENTS} {...props} />;
    case status.status === kysStatuses.DOCUMENTS_SENT && !status.reason:
      return <NotVerified step={stepStatuses.VERIFICATION_IS_PENDING} {...props} />;
    case status.status === kysStatuses.PENDING && !!status.reason:
      return <Refused {...props} />;
    case status.status === kysStatuses.VERIFIED:
      return <Verified {...props} />;
    default:
      return <div>Unknown step</div>;
  }
};
VerifyData.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.kycStatus,
};

VerifyData.defaultProps = {
  status: null,
};

export default VerifyData;
