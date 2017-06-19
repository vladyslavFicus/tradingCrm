import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import CopyToClipboard from '../CopyToClipboard';

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
  };
  static defaultProps = {
    uuidPrefix: null,
    uuidPartsCount: 1,
    notificationLevel: 'info',
    notificationTitle: I18n.t('COMMON.NOTIFICATIONS.COPY_FULL_UUID.TITLE'),
    notificationMessage: I18n.t('COMMON.NOTIFICATIONS.COPY_FULL_UUID.MESSAGE'),
    notify: true,
    length: null,
  };

  renderUuid = (uuid, prefix, size) => {
    if (!uuid) {
      return uuid;
    }

    const elements = uuid.split('-');

    if (!prefix) {
      const sourcePrefix = elements[0];

      if (sourcePrefix.toUpperCase() === sourcePrefix) {
        elements[0] = sourcePrefix.slice(0, size + 1);

        return elements.slice(0, 2).join('-');
      }
    }

    const id = elements.slice(0, size).join('-');
    return prefix ? [prefix, id].join('-') : id;
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
      >
        <span>{this.renderUuid(uuid, uuidPrefix, uuidPartsCount)}</span>
      </CopyToClipboard>
    );
  }
}

export default Uuid;
