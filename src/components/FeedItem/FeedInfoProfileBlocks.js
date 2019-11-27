import React from 'react';
import PropTypes from '../../constants/propTypes';
import {
  reasons as blockReasons,
  unblockReasons,
  statusesLabels,
} from '../../constants/user';
import { types } from '../../constants/audit';
import renderLabel from '../../utils/renderLabel';
import FeedDetails from './FeedDetails';

const attributeLabels = {
  reason: 'COMMON.REASON',
  profileStatus: 'COMMON.STATUS',
};

const FeedInfoProfileBlocks = ({ data: { details, type } }) => {
  const reasons = type === types.PLAYER_PROFILE_BLOCKED ? blockReasons : unblockReasons;

  return (
    <FeedDetails
      items={details}
      formatters={{
        reason: [value => renderLabel(value, reasons)],
        profileStatus: [value => renderLabel(value, statusesLabels)],
      }}
      attributeLabels={attributeLabels}
    />
  );
};

FeedInfoProfileBlocks.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoProfileBlocks;
