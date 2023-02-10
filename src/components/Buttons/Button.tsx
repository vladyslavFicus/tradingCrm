import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import CircleLoader from 'components/CircleLoader';
import './Button.scss';

interface Props extends React.HTMLProps<HTMLButtonElement> {
  children: React.ReactNode,
  autoFocus?: boolean,
  className?: string,
  type?: 'button' | 'submit',
  submitting?: boolean,
  disabled?: boolean,
  tertiary?: boolean,
  primary?: boolean,
  secondary?: boolean,
  icon?: boolean,
  danger?: boolean,
  onClick?: () => void,
  small?: boolean,
  stopPropagation?: boolean,
}

const Button = (props: Props) => {
  const {
    children,
    className,
    submitting,
    disabled,
    tertiary,
    primary,
    secondary,
    icon,
    danger,
    small,
    type,
    stopPropagation,
    ...rest
  } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    // Enable autofocus on next tick (because in the same tick it isn't working)
    if (props.autoFocus) {
      setTimeout(() => buttonRef.current?.focus(), 0);
    }
  }, []);

  /**
   * Should be here to prevent synthetic event errors
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { onClick } = props;

    if (onClick) onClick();

    if (stopPropagation) event.stopPropagation();
  };

  return (
    <button
      {...rest}
      // TODO investigate issue with react/button-has-type
      type={type === 'submit' ? 'submit' : 'button'}
      ref={buttonRef}
      onClick={handleClick}
      className={
        classNames(
          'Button',
          className,
          {
            'Button--primary': primary,
            'Button--secondary': secondary,
            'Button--tertiary': tertiary,
            'Button--icon': icon,
            'Button--danger': danger,
            'Button--small': small,
          },
        )
      }
      disabled={!!submitting || !!disabled}
    >
      {/* Show loader if submitting === true */}
      <If condition={!!submitting}>
        <div className="Button__loader">
          <CircleLoader />
        </div>
      </If>

      {/* Make content invisible while submitting === true */}
      <div className={classNames('Button__content', { 'Button__content--submitting': submitting })}>
        {children}
      </div>
    </button>
  );
};

export default React.memo(Button);
