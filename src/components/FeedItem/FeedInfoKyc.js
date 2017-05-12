import React from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';
import { types } from '../../constants/audit';
import { shortify } from '../../utils/uuid';

const formatters = {
  uploadedFileList: [() => null],
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

      const value = formatValue(
        attribute,
        Array.isArray(data.details[attribute])
          ? data.details[attribute]
          : data.details[attribute].toString()
      );

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
      data.details.uploadedFileList && data.details.uploadedFileList.length > 0 &&
      <div>
        {data.details.uploadedFileList.map((file, index) => (
          <div key={file.uuid}>
            {index + 1}.
            {' '}
            {I18n.t('FEED_ITEM.LOG_IN.UPLOADED_FILE')}
            {' - '}<span className="feed-item_info-details_value">{file.name}</span>
            ` - ${shortify(file.uuid)}`
          </div>
        ))}
      </div>
    }
    {
      [types.KYC_PERSONAL_REFUSED, types.KYC_ADDRESS_REFUSED].indexOf(data.type) > -1 && data.details.reason &&
      <div className="rejection">
        <span className="rejection_heading">{I18n.t('FEED_ITEM.KYC.REJECT_REASON')}:</span> {data.details.reason}
      </div>
    }
  </div>
);

FeedInfoKyc.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoKyc;
