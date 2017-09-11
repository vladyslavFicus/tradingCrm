import React from 'react';
import moment from 'moment';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';

const formatters = {
  birthDate: [value => moment(value).format('DD.MM.YYYY')],
  tokenExpirationDate: [value => moment.utc(value).local().format('DD.MM.YYYY HH:mm:ss')],
};
const formatValue = (attribute, value) => {
  return formatters[attribute]
    ? formatters[attribute].reduce((res, formatter) => formatter(res), value)
    : value;
};

const FeedInfoProfileRegistered = ({ data }) => (
  <div className="feed-item_info-details">
    {Object.keys(data.details).map(attribute => (
      <div key={attribute}>
        {attributeLabels[attribute] || attribute}:
        <span className="feed-item_info-details_value">
          {formatValue(attribute, data.details[attribute].toString())}
        </span>
      </div>
    ))}
  </div>
);

FeedInfoProfileRegistered.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoProfileRegistered;
