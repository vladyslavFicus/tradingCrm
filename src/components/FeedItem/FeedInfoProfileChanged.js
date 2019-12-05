import React from 'react';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';
import FeedDetails from './FeedDetails';

const FeedInfoProfileChanged = ({ data: { details: { contacts, address, ...rest } } }) => {
  const items = {
    ...(typeof address === 'string' ? { address } : { ...address }),
    ...contacts,
    ...rest,
  };

  return (
    <FeedDetails
      items={items}
      attributeLabels={attributeLabels}
    />
  );
};

FeedInfoProfileChanged.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoProfileChanged;
