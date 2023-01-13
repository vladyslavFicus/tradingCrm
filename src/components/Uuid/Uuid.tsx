import React from 'react';
import { shortify } from 'utils/uuid';
import CopyToClipboard from '../CopyToClipboard';
import './Uuid.scss';

type Props = {
  id?: string,
  uuid: string,
  uuidPrefix?: string,
  uuidPostfix?: null,
  uuidPartsCount?: number,
  title?: string,
  notify?: boolean,
  notificationLevel?: string,
  notificationTitle?: string,
  notificationMessage?: string,
  length?: number,
  className?: string,
};

const Uuid = (props: Props) => {
  const {
    id,
    uuid: inputUUID,
    uuidPrefix,
    uuidPostfix,
    uuidPartsCount = 2,
    title,
    notify = true,
    notificationLevel = 'info',
    notificationTitle = 'COMMON.NOTIFICATIONS.COPY_FULL_UUID.TITLE',
    notificationMessage = 'COMMON.NOTIFICATIONS.COPY_FULL_UUID.MESSAGE',
    length,
    className,
  } = props;

  const uuid = inputUUID.substring(0, length);

  return (
    <CopyToClipboard
      text={inputUUID}
      withNotification={notify}
      notificationLevel={notificationLevel}
      notificationTitle={notificationTitle}
      notificationMessage={notificationMessage}
      className={className}
    >
      <span id={id} className="Uuid__value">
        {title || shortify(uuid, uuidPrefix, uuidPartsCount, uuidPostfix, length)}
      </span>
    </CopyToClipboard>
  );
};

export default React.memo(Uuid);
