import React from 'react';
import ClipboardContainer from 'react-copy-to-clipboard';
import classNames from 'classnames';
import { LevelType } from 'providers/NotificationProvider';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import './CopyToClipboard.scss';

type Props = {
  text: string,
  children: React.ReactNode,
  withNotification: boolean,
  notificationTitle: string,
  notificationMessage: string,
  notificationLevel?: LevelType,
  className?: string,
};

const CopyToClipboard = (props: Props) => {
  const {
    text,
    children,
    className,
    withNotification,
    notificationTitle,
    notificationMessage,
    notificationLevel,
  } = props;

  const {
    highlight,
    handleClick,
    handleCopy,
  } = useCopyToClipboard({
    withNotification,
    notificationTitle,
    notificationMessage,
    notificationLevel,
  });

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
