import React from 'react';
import Badge from 'components/Badge';
import { getPlatformTypeLabel } from 'utils/tradingAccount';

type Position = 'right' | 'left';

type Props = {
  children: React.ReactNode,
  platformType: string,
  position?: Position,
  warning?: boolean,
  success?: boolean,
  danger?: boolean,
  center?: boolean,
  info?: boolean,
};

const PlatformTypeBadge = (props: Props) => {
  const {
    children,
    platformType,
    ...rest
  } = props;

  return (
    <Badge
      text={getPlatformTypeLabel(platformType)}
      backgroundColor={
        platformType === 'MT5' ? 'var(--state-colors-success)' : 'var(--state-colors-warning)'
      }
      color="var(--text-primary)"
      {...rest}
    >
      {children}
    </Badge>
  );
};

export default React.memo(PlatformTypeBadge);
