import React, { ReactNode, useRef } from 'react';
import NotificationContainer from 'react-notification-system';

type Props = {
  children: ReactNode | ReactNode[],
}

const CoreLayout = (props: Props) => {
  const { children } = props;

  const notificationNodeRef = useRef<NotificationContainer | null>(null);

  return (
    <>
      {children}

      <NotificationContainer
        ref={(node) => {
          notificationNodeRef.current = node;
        }}
        style={{
          Containers: {
            DefaultStyle: { zIndex: 9999 },
            bc: {
              left: 'auto',
              right: '0px',
            },
          },
        }}
      />
    </>
  );
};

export default React.memo(CoreLayout);
