import React, { Fragment } from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { attributeLabels } from '../../constants/user';
import { types } from '../../constants/audit';
import Uuid from '../Uuid';

const formatters = {
  uploadedFileList: [() => null],
  reason: [() => null],
  creationDate: [() => null],
  birthDate: [value => moment(value).format('DD.MM.YYYY')],
};
const formatValue = (attribute, value) => (formatters[attribute]
  ? formatters[attribute].reduce((res, formatter) => formatter(res), value)
  : value);

const FeedInfoKyc = ({ data }) => (
  <Fragment>
    {Object.keys(data.details).map((attribute) => {
      if (data.details[attribute] === null) {
        return null;
      }

      const value = formatValue(
        attribute,
        Array.isArray(data.details[attribute])
          ? data.details[attribute]
          : data.details[attribute].toString(),
      );

      return (
        <If condition={value !== null}>
          <Fragment key={attribute}>
            {attributeLabels[attribute] || attribute}:
            <span className="feed-item__content-value">
              {value}
            </span>
            <br />
          </Fragment>
        </If>
      );
    })}
    <If condition={data.details.uploadedFileList && data.details.uploadedFileList.length > 0}>
      {data.details.uploadedFileList.map((file, index) => (
        <div key={file.uuid}>
          {index + 1}.
          {' '} {I18n.t('FEED_ITEM.LOG_IN.UPLOADED_FILE')}
          {' - '}<span className="feed-item__content-value">{file.name}</span>{' - '}
          <Uuid uuid={file.uuid} />
        </div>
      ))}
    </If>
    <If
      condition={[types.KYC_PERSONAL_REFUSED, types.KYC_ADDRESS_REFUSED].indexOf(data.type) > -1 && data.details.reason}
    >
      <div className="feed-item__rejection">
        <b className="mr-1">{I18n.t('FEED_ITEM.KYC.REJECT_REASON')}:</b>
        {data.details.reason}
      </div>
    </If>
  </Fragment>
);

FeedInfoKyc.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoKyc;
