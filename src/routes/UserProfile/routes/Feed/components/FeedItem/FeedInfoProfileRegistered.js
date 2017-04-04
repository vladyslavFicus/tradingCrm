import React from 'react';
import PropTypes from '../../../../../../constants/propTypes';
import { attributeLabels } from '../../../../../../constants/user';
import moment from 'moment';

const formaters = {
  birthDate: [value => moment(value).format('DD.MM.YYYY')],
  tokenExpirationDate: [value => moment(value).format('YYYY-MM-DD HH:mm:ss')],
};
const formatValue = (attribute, value) => {
  return formaters[attribute]
    ? formaters[attribute].reduce((res, formatter) => formatter(res), value)
    : value;
};

const FeedInfoProfileRegistered = ({ data }) => (
  <div className="information">
    {Object.keys(data.details).map(attribute => (
      <div key={attribute}>
        {attributeLabels[attribute] || attribute}:
        <span className="information_value">
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
