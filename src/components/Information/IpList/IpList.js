import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../constants/propTypes';
import CopyToClipboard from '../../CopyToClipboard';
import Card, { Content } from '../../Card';

class IpList extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    ips: PropTypes.arrayOf(PropTypes.ipEntity),
    notify: PropTypes.bool,
    notificationLevel: PropTypes.string,
    notificationTitle: PropTypes.string,
    notificationMessage: PropTypes.string,
  };
  static defaultProps = {
    ips: [],
    notificationLevel: 'info',
    notificationTitle: I18n.t('COMMON.NOTIFICATIONS.COPIED'),
    notificationMessage: I18n.t('COMMON.NOTIFICATIONS.COPY_FULL_IP.MESSAGE'),
    notify: true,
  };

  render() {
    const { label, ips, notificationLevel, notificationTitle, notificationMessage, notify } = this.props;

    return (
      <div className="account-details__network">
        <span className="account-details__label">{label}</span>
        <Card>
          <Content>
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
          </Content>
        </Card>
      </div>
    );
  }
}

export default IpList;
