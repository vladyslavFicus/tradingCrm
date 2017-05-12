import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { shortify } from '../../utils/uuid';

const FeedInfoPlayerProfileViewed = ({ data }) => (
  <div className="feed-item_info-details">
    <div>
      {I18n.t('COMMON.PLAYER')}:
      <span className="feed-item_info-details_value">
        {data.details.firstName} {data.details.lastName}
      </span>
      {` - ${shortify(data.details.playerUUID, 'PL')}`}
    </div>
  </div>
);
FeedInfoPlayerProfileViewed.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoPlayerProfileViewed;
