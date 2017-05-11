import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';

const FeedInfoProfileChanged = ({ data }) => (
  <div className="feed-item_info-details">
    {Object.keys(data.details).map(attribute => (
      <div key={attribute}>
        {attributeLabels[attribute] || attribute}:
        <span className="feed-item_info-details_value">
          {data.details[attribute].toString()}
        </span>
      </div>
    ))}
  </div>
);

FeedInfoProfileChanged.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoProfileChanged;
