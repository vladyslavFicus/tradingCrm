import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import CopyToClipboard from 'components/CopyToClipboard';

const IpList = (props) => {
  const {
    label,
    ips,
    notificationLevel,
    notificationTitle,
    notificationMessage,
    notify,
  } = props;

  return (
    <Fragment>
      <div className="account-details__label">
        {label}
      </div>
      <div className="card">
        <div className="card-body">
          {ips.map(item => (
            <div className="ip-container" key={item.ipAddress}>
              <i
                className={`fs-icon fs-${item.country.toLowerCase()}`}
                style={{ marginRight: 10 }}
              />
              <CopyToClipboard
                text={item.ipAddress}
                notify={notify}
                notificationLevel={notificationLevel}
                notificationTitle={notificationTitle}
                notificationMessage={notificationMessage}
              >
                <span>{item.ipAddress}</span>
              </CopyToClipboard>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

IpList.propTypes = {
  label: PropTypes.string.isRequired,
  ips: PropTypes.arrayOf(PropTypes.operatorIpEntity),
  notify: PropTypes.bool,
  notificationLevel: PropTypes.string,
  notificationTitle: PropTypes.string,
  notificationMessage: PropTypes.string,
};
IpList.defaultProps = {
  ips: [],
  notificationLevel: 'info',
  notificationTitle: I18n.t('COMMON.NOTIFICATIONS.COPIED'),
  notificationMessage: I18n.t('COMMON.NOTIFICATIONS.COPY_FULL_IP.MESSAGE'),
  notify: true,
};

export default IpList;
