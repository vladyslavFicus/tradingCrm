import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../constants/propTypes';
import CopyToClipboard from '../../CopyToClipboard';
import Card, { Content } from '../../Card';

const IpList = ({ label, ips, notificationLevel, notificationTitle, notificationMessage, notify }) => (
  <div className="account-details__network">
    <span className="account-details__label">{label}</span>
    <Card>
      <Content>
        <Choose>
          <When condition={ips && ips.length > 0}>
            {
              ips.map(item => (
                <div className="ip-container" key={item.ip}>
                  <i
                    className={`fs-icon fs-${item.country.toLowerCase()}`}
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
              ))
            }
          </When>
          <Otherwise>
            {''}
          </Otherwise>
        </Choose>
      </Content>
    </Card>
  </div>
);

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
