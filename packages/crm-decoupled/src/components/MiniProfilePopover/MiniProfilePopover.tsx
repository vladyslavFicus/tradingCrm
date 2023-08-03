import React, { useRef, useState } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import OperatorMiniProfile from './OperatorMiniProfile';
import LeadMiniProfile from './LeadMiniProfile';
import ClientMiniProfile from './ClientMiniProfile';
import './MiniProfilePopover.scss';

type Props = {
  type: string,
  uuid: string,
  children: React.ReactNode,
}

const MiniProfilePopover = (props: Props) => {
  const { type, uuid, children } = props;

  const ref = useRef<HTMLElement>(null);
  const timerRef = useRef<any>(null);

  const [isHover, setHover] = useState<boolean>(false);

  const handleHover = (hover: boolean) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setHover(hover);
    }, 500);
  };

  const handleMouseOver = () => {
    handleHover(true);
  };

  const handleMouseOut = () => {
    handleHover(false);
  };

  return (
    <span
      ref={ref}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {children}

      <If condition={isHover}>
        <Popover
          isOpen
          hideArrow
          target={ref}
          popperClassName="MiniProfilePopover"
          trigger="legacy"
        >
          <PopoverBody>
            <Choose>
              <When condition={type === 'operator'}>
                <OperatorMiniProfile uuid={uuid} />
              </When>

              <When condition={type === 'lead'}>
                <LeadMiniProfile uuid={uuid} />
              </When>

              <When condition={type === 'client'}>
                <ClientMiniProfile playerUUID={uuid} />
              </When>
            </Choose>
          </PopoverBody>
        </Popover>
      </If>
    </span>
  );
};

export default React.memo(MiniProfilePopover);
