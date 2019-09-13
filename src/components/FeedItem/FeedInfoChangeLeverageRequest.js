import React from 'react';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';
import FeedDetails from './FeedDetails';

const FeedInfoChangeLeverageRequest = ({ data: { details } }) => (
  <FeedDetails
    items={details}
    attributeLabels={attributeLabels}
  />
);

FeedInfoChangeLeverageRequest.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoChangeLeverageRequest;
