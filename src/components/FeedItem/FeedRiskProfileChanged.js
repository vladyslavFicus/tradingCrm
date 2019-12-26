import React from 'react';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';
import FeedDetails from './FeedDetails';

const FeedRiskProfileChanged = ({ data: { details } }) => (
  <FeedDetails
    items={details}
    attributeLabels={attributeLabels}
  />
);

FeedRiskProfileChanged.propTypes = {
  data: PropTypes.shape({
    totalScore: PropTypes.string,
    riskCategory: PropTypes.string,
  }).isRequired,
};

export default FeedRiskProfileChanged;
