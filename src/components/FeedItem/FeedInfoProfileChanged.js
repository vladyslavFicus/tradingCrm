import React from 'react';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';
import FeedDetails from './FeedDetails';

const FeedInfoProfileChanged = ({
  data: {
    details: {
      contacts,
      address,
      passport,
      ...rest
    },
  },
}) => {
  const passportData = {
    passportNumber: passport.number,
    passPortExpirationDate: passport.expirationDate,
  };

  const items = {
    ...(typeof address === 'string' ? { address } : { ...address }),
    ...(typeof passport !== 'string' && passportData),
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
