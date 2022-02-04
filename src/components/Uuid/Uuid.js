import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from '../CopyToClipboard';
import { shortify } from '../../utils/uuid';

const Uuid = ({
  id,
  uuid: inputUUID,
  uuidPrefix,
  uuidPostfix,
  uuidPartsCount,
  title,
  notify,
  notificationLevel,
  notificationTitle,
  notificationMessage,
  length,
  className,
}) => {
  let uuid = inputUUID;
  if (length) {
    uuid = inputUUID.substring(0, length);
  }

  return (
    <CopyToClipboard
      text={inputUUID}
      withNotification={notify}
      notificationLevel={notificationLevel}
      notificationTitle={notificationTitle}
      notificationMessage={notificationMessage}
      className={className}
    >
      <span id={id}>{title || shortify(uuid, uuidPrefix, uuidPartsCount, uuidPostfix, length)}</span>
    </CopyToClipboard>
  );
};

Uuid.propTypes = {
  id: PropTypes.string,
  uuid: PropTypes.string.isRequired,
  uuidPrefix: PropTypes.string,
  uuidPostfix: PropTypes.string,
  uuidPartsCount: PropTypes.number,
  title: PropTypes.string,
  notify: PropTypes.bool,
  notificationLevel: PropTypes.string,
  notificationTitle: PropTypes.string,
  notificationMessage: PropTypes.string,
  length: PropTypes.number,
  className: PropTypes.string,
};

Uuid.defaultProps = {
  id: null,
  uuidPrefix: null,
  uuidPostfix: null,
  uuidPartsCount: 2,
  title: null,
  notificationLevel: 'info',
  notificationTitle: 'COMMON.NOTIFICATIONS.COPY_FULL_UUID.TITLE',
  notificationMessage: 'COMMON.NOTIFICATIONS.COPY_FULL_UUID.MESSAGE',
  notify: true,
  length: null,
  className: null,
};

export default React.memo(Uuid);
