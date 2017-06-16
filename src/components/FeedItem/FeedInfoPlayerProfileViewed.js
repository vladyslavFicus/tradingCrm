import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import Uuid from '../Uuid';

const FeedInfoPlayerProfileViewed = ({ data }) => (
  <div className="feed-item_info-details">
    <div>
      {I18n.t('COMMON.PLAYER')}:
      <span className="feed-item_info-details_value">
        {data.details.firstName} {data.details.lastName}
      </span>
      {' - '}
      <Uuid
        uuid={data.details.playerUUID}
        uuidPrefix={data.details.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
      />
    </div>
  </div>
);
FeedInfoPlayerProfileViewed.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoPlayerProfileViewed;
