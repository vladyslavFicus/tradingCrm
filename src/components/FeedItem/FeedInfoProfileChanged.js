import React from 'react';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';
import FeedDetails from './FeedDetails';

const FeedInfoProfileChanged = ({ data: { details } }) => (
  <FeedDetails
    items={details}
    attributeLabels={attributeLabels}
  />
);

FeedInfoProfileChanged.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoProfileChanged;
