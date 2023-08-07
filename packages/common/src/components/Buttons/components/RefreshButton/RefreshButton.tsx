import React, { useState } from 'react';
import classNames from 'classnames';
import Button from '../../Button';
import './RefreshButton.scss';

const RefreshButton = (props: Omit<React.ComponentProps<typeof Button>, 'children'>) => {
  const {
    className = '',
    onClick = () => {},
    ...rest
  } = props;

  const [isAnimationRunning, setIsAnimationRunning] = useState<boolean>(false);

  const handleClick = async () => {
    if (isAnimationRunning) {
      return;
    }

    setIsAnimationRunning(true);

    await onClick();

    setIsAnimationRunning(false);
  };

  return (
    <Button
      {...rest}
      tertiary
      className={classNames('RefreshButton', className)}
      onClick={handleClick}
    >
      <i
        className={classNames(
          'fa fa-refresh RefreshButton__icon',
          { 'RefreshButton__icon--spin': isAnimationRunning },
        )}
      />
    </Button>
  );
};

export default React.memo(RefreshButton);
