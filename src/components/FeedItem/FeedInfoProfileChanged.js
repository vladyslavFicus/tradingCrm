import React, { Fragment } from 'react';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';

const FeedInfoProfileChanged = ({ data }) => (
  <Fragment>
    {Object.keys(data.details).map(attribute => (
      <Fragment key={attribute}>
        {attributeLabels[attribute] || attribute}:
        <span className="feed-item__content-value">
          {data.details[attribute].toString()}
        </span>
        <br />
      </Fragment>
    ))}
  </Fragment>
);

FeedInfoProfileChanged.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoProfileChanged;
