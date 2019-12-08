import React from 'react';
import moment from 'moment';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';
import FeedDetails from './FeedDetails';

const FeedInfoProfileRegistered = ({
  data: {
    details: {
      registrationDetails,
      initialKyc,
      affiliate,
      contacts,
      address,
      status,
      ...rest
    },
  },
}) => {
  let affiliateData = {};

  if (affiliate) {
    affiliateData = {
      affiliateUuid: affiliate.uuid,
      affiliateFirstName: affiliate.firstName,
      affiliateReferral: affiliate.referral,
      affiliateSource: affiliate.source,
    };
  }

  const items = {
    ...registrationDetails,
    ...affiliateData,
    ...initialKyc,
    ...contacts,
    ...address,
    ...status,
    ...rest,
  };

  return (
    <FeedDetails
      items={items}
      formatters={{
        birthDate: [value => moment(value).format('DD.MM.YYYY')],
        tokenExpirationDate: [value => moment.utc(value).local().format('DD.MM.YYYY HH:mm:ss')],
        registrationDate: [value => moment.utc(value).local().format('DD.MM.YYYY HH:mm:ss')],
      }}
      attributeLabels={attributeLabels}
    />
  );
};

FeedInfoProfileRegistered.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoProfileRegistered;
