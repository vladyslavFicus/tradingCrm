import React from 'react';
import PropTypes from '../../constants/propTypes';
import { reasons, statusesLabels } from '../../constants/user';
import renderLabel from '../../utils/renderLabel';
import FeedDetails from './FeedDetails';

const FeedInfoProfileBlocked = ({ data: { details } }) => (
  <FeedDetails
    items={details}
    formatters={{
      reason: [value => renderLabel(value, reasons)],
      profileStatus: [value => renderLabel(value, statusesLabels)],
    }}
  />
);

FeedInfoProfileBlocked.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoProfileBlocked;
