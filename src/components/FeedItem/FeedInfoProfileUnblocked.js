import React from 'react';
import PropTypes from '../../constants/propTypes';
import { unblockReasons, statusesLabels } from '../../constants/user';
import renderLabel from '../../utils/renderLabel';
import FeedDetails from './FeedDetails';

const FeedInfoProfileUnblocked = ({ data: { details } }) => (
  <FeedDetails
    items={details}
    formatters={{
      reason: [value => renderLabel(value, unblockReasons)],
      profileStatus: [value => renderLabel(value, statusesLabels)],
    }}
  />
);

FeedInfoProfileUnblocked.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoProfileUnblocked;
