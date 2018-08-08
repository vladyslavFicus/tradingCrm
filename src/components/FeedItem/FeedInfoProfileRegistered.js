import React, { Fragment } from 'react';
import moment from 'moment';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';

const formatters = {
  birthDate: [value => moment(value).format('DD.MM.YYYY')],
  tokenExpirationDate: [value => moment.utc(value).local().format('DD.MM.YYYY HH:mm:ss')],
  registrationDate: [value => moment.utc(value).local().format('DD.MM.YYYY HH:mm:ss')],
};
const formatValue = (attribute, value) => (
  formatters[attribute] ? formatters[attribute].reduce((res, formatter) => formatter(res), value) : value
);

const FeedInfoProfileRegistered = ({ data }) => (
  <Fragment>
    {Object.keys(data.details).map(attribute => (
      <Fragment key={attribute}>
        {attributeLabels[attribute] || attribute}:
        <span className="feed-item__content-value">
          {formatValue(attribute, data.details[attribute].toString())}
        </span>
        <br />
      </Fragment>
    ))}
  </Fragment>
);

FeedInfoProfileRegistered.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoProfileRegistered;
