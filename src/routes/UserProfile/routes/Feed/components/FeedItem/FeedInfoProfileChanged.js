import React from 'react';
import PropTypes from '../../../../../../constants/propTypes';
import { attributeLabels } from '../../../../../../constants/user';

const FeedInfoProfileChanged = ({ data }) => (
  <div className="information">
    {Object.keys(data.details).map(attribute => (
      <div key={attribute}>
        {attributeLabels[attribute] || attribute}:
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
