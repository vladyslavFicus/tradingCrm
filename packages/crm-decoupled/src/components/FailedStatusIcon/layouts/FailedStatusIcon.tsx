import React from 'react';
import { Tooltip } from 'reactstrap';
import useFailedStatusIcon from 'components/FailedStatusIcon/hooks/useFailedStatusIcon';
import './FailedStatusIcon.scss';

type Props = {
  id: string,
  children: React.ReactNode,
  showTimeout?: number,
  hideTimeout?: number,
  iconClassName?: string,
}

const FailedStatusIcon = (props: Props) => {
  const {
    id,
    children,
    showTimeout = 350,
    hideTimeout = 250,
    iconClassName = 'FailedStatusIcon',
  } = props;

  const { tooltipOpen, onToggle } = useFailedStatusIcon();

  return (
    <>
      <i id={id} className={iconClassName} />

      <Tooltip
        placement="bottom"
        target={id}
        isOpen={tooltipOpen}
        delay={{ show: showTimeout, hide: hideTimeout }}
        toggle={onToggle}
      >
        {children}
      </Tooltip>
    </>
  );
};

export default React.memo(FailedStatusIcon);
