import React, { Fragment } from 'react';
import { uniqBy } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from '../../../constants/propTypes';
import CopyToClipboard from '../../CopyToClipboard';

const IpList = (props) => {
  const {
    label,
    ips,
    notificationLevel,
    notificationTitle,
    notificationMessage,
    notify,
  } = props;

  const uniqueIps = uniqBy(ips, ({ ip }) => ip);

  return (
    <Fragment>
      <div className="account-details__personal-info">
        <span className="account-details__label">
          {label}
        </span>
        <div className="card">
          <div className="card-body">
            <Choose>
              <When condition={uniqueIps && uniqueIps.length > 0}>
                {uniqueIps.map(item => (
                  <div className="ip-container" key={item.ip}>
                    <i
                      className={`fs-icon fs-${item.countryCode.toLowerCase()}`}
                      style={{ marginRight: 10 }}
                    />
                    <CopyToClipboard
                      text={item.ip}
                      notify={notify}
                      notificationLevel={notificationLevel}
                      notificationTitle={notificationTitle}
                      notificationMessage={notificationMessage}
                    >
                      <span>{item.ip}</span>
                    </CopyToClipboard>
                  </div>
                ))}
              </When>
              <Otherwise>
                {''}
              </Otherwise>
            </Choose>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

IpList.propTypes = {
  label: PropTypes.string.isRequired,
  ips: PropTypes.arrayOf(PropTypes.ipEntity),
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
