import React, { useState, useCallback } from 'react';
import I18n from 'i18n-js';
import customTimeout from 'utils/customTimeout';
import { notify, LevelType } from 'providers/NotificationProvider';

type Props = {
  withNotification: boolean,
  notificationTitle: string,
  notificationMessage: string,
  notificationLevel?: LevelType,
};

type UseCopyToClipboard = {
  highlight: boolean,
  handleCopy: () => void,
  handleClick: (e: React.MouseEvent<HTMLSpanElement>) => void,
};

const CopyToClipboard = (props: Props): UseCopyToClipboard => {
  const {
    withNotification,
    notificationTitle,
    notificationMessage,
    notificationLevel = LevelType.INFO,
  } = props;

  const [highlight, setHighlight] = useState<boolean>(false);

  const handleClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
  }, []);

  const handleCopy = useCallback(() => {
    setHighlight(true);

    if (withNotification) {
      notify({
        level: notificationLevel,
        title: I18n.t(`${notificationTitle}`),
        message: I18n.t(`${notificationMessage}`),
      });
    }

    customTimeout(() => setHighlight(false), 500);
  }, [withNotification, notificationLevel, notificationTitle, notificationMessage]);

  return {
    highlight,
    handleClick,
    handleCopy,
  };
};

export default CopyToClipboard;
