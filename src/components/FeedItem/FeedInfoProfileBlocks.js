import React from 'react';
import I18n from 'i18n-js';
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
        reason: [value => I18n.t(renderLabel(value, reasons))],
        profileStatus: [value => I18n.t(renderLabel(value, statusesLabels))],
      }}
      attributeLabels={attributeLabels}
    />
  );
};

FeedInfoProfileBlocks.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoProfileBlocks;
