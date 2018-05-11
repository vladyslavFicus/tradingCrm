import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import CopyToClipboard from '../CopyToClipboard';
import { shortify } from '../../utils/uuid';

class Uuid extends Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    uuidPrefix: PropTypes.string,
    uuidPartsCount: PropTypes.number,
    notify: PropTypes.bool,
    notificationLevel: PropTypes.string,
    notificationTitle: PropTypes.string,
    notificationMessage: PropTypes.string,
    length: PropTypes.number,
    className: PropTypes.string,
  };
  static defaultProps = {
    uuidPrefix: null,
    uuidPartsCount: 2,
    notificationLevel: 'info',
    notificationTitle: I18n.t('COMMON.NOTIFICATIONS.COPY_FULL_UUID.TITLE'),
    notificationMessage: I18n.t('COMMON.NOTIFICATIONS.COPY_FULL_UUID.MESSAGE'),
    notify: true,
    length: null,
    className: null,
  };

  render() {
    const {
      uuid: inputUUID,
      uuidPrefix,
      uuidPartsCount,
      notify,
      notificationLevel,
      notificationTitle,
      notificationMessage,
      length,
      className,
    } = this.props;

    let uuid = inputUUID;
    if (length) {
      uuid = inputUUID.substring(0, length);
    }

    return (
      <CopyToClipboard
        notify={notify}
        text={inputUUID}
        notificationLevel={notificationLevel}
        notificationTitle={notificationTitle}
        notificationMessage={notificationMessage}
        className={className}
      >
        <span>{shortify(uuid, uuidPrefix, uuidPartsCount)}</span>
      </CopyToClipboard>
    );
  }
}

export default Uuid;
