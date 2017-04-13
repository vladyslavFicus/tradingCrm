import React from 'react';
import moment from 'moment';
import PropTypes from '../../../../../../constants/propTypes';
import { attributeLabels } from '../../../../../../constants/user';
import { types } from '../../../../../../constants/audit';

const formatters = {
  uploadedFileList: [
    value => value,
  ],
  reason: [() => null],
  creationDate: [() => null],
  birthDate: [value => moment(value).format('DD.MM.YYYY')],
};
const formatValue = (attribute, value) => formatters[attribute]
  ? formatters[attribute].reduce((res, formatter) => formatter(res), value)
  : value;

const FeedInfoKyc = ({ data }) => (
  <div className="feed-item_info-details">
    {Object.keys(data.details).map((attribute) => {
      if (data.details[attribute] === null) {
        return null;
      }

      const value = formatValue(attribute, data.details[attribute].toString());

      return value === null ? null : (
        <div key={attribute}>
          {attributeLabels[attribute] || attribute}:
          <span className="feed-item_info-details_value">
            {value}
          </span>
        </div>
      );
    })}
    {
      [types.KYC_PERSONAL_REFUSED, types.KYC_ADDRESS_REFUSED].indexOf(data.type) > -1 && data.details.reason &&
      <div className="rejection">
        <span className="rejection_heading">Rejection reason:</span> {data.details.reason}
      </div>
    }
  </div>
);

FeedInfoKyc.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoKyc;
