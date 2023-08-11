import React from 'react';
import { Utils, Types } from '@crm/common';
import CopyToClipboard from 'components/CopyToClipboard';
import useUuid from '../hooks/useUuid';
import './Uuid.scss';

type Props = {
  id?: string,
  uuid: string,
  uuidPrefix?: string,
  uuidPostfix?: string,
  uuidPartsCount?: number,
  title?: string,
  notify?: boolean,
  notificationLevel?: Types.LevelType,
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
    notificationLevel,
    notificationTitle = 'COMMON.NOTIFICATIONS.COPY_FULL_UUID.TITLE',
    notificationMessage = 'COMMON.NOTIFICATIONS.COPY_FULL_UUID.MESSAGE',
    length,
    className,
  } = props;

  const { uuid } = useUuid({ uuid: inputUUID, length });

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
        {title || Utils.uuidShortify(uuid, uuidPrefix, uuidPartsCount, uuidPostfix, length)}
      </span>
    </CopyToClipboard>
  );
};

export default React.memo(Uuid);
