import React from 'react';
import moment from 'moment';
import PropTypes from '../../../../../../constants/propTypes';

const FeedInfoProfileChanged = ({ data }) => (
  <div className="information">
    {Object.keys(data.details).map(attribute => (
      <div>
        {attribute}:
        <span className="information_value">
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
