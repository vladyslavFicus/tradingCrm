import React from 'react';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';
import FeedDetails from './FeedDetails';

const FeedInfoKYCChanged = ({ data: { details } }) => (
  <FeedDetails
    items={details}
    attributeLabels={attributeLabels}
  />
);

FeedInfoKYCChanged.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoKYCChanged;
