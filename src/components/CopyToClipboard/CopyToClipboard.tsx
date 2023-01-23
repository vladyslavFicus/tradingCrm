import React, { useState } from 'react';
import I18n from 'i18n-js';
import ClipboardContainer from 'react-copy-to-clipboard';
import classNames from 'classnames';
import customTimeout from 'utils/customTimeout';
import { notify, LevelType } from 'providers/NotificationProvider';
import './CopyToClipboard.scss';

type Props = {
  text: string,
  children: React.ReactNode,
  className?: string,
  withNotification?: boolean,
  notificationTitle?: string,
  notificationMessage?: string,
  notificationLevel?: LevelType,
};

const CopyToClipboard = (props: Props) => {
  const {
    text,
    children,
    className,
    withNotification,
    notificationTitle,
    notificationMessage,
    notificationLevel = LevelType.INFO,
  } = props;

  const [highlight, setHighlight] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
  };

  const handleCopy = () => {
    setHighlight(true);

    if (withNotification) {
      notify({
        level: notificationLevel,
        title: I18n.t(`${notificationTitle}`),
        message: I18n.t(`${notificationMessage}`),
      });
    }

    customTimeout(() => setHighlight(false), 500);
  };

  return (
    <span
      onClick={handleClick}
      className={classNames('CopyToClipboard', className, { 'CopyToClipboard--highlight': highlight })}
    >
      <ClipboardContainer text={text} onCopy={handleCopy}>
        {children}
      </ClipboardContainer>
    </span>
  );
};

export default React.memo(CopyToClipboard);
