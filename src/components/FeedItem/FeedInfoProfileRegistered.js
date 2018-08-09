import React from 'react';
import moment from 'moment';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';
import FeedDetails from './FeedDetails';

const FeedInfoProfileRegistered = ({ data: { details } }) => (
  <FeedDetails
    items={details}
    formatters={{
      birthDate: [value => moment(value).format('DD.MM.YYYY')],
      tokenExpirationDate: [value => moment.utc(value).local().format('DD.MM.YYYY HH:mm:ss')],
      registrationDate: [value => moment.utc(value).local().format('DD.MM.YYYY HH:mm:ss')],
    }}
    attributeLabels={attributeLabels}
  />
);

FeedInfoProfileRegistered.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoProfileRegistered;
