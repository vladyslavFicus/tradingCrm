import React from 'react';
import classNames from 'classnames';
import { Button } from 'components';
import { ReactComponent as MinusIcon } from './minus-icon.svg';
import './RemoveTimeIntervalButton.scss';

const RemoveTimeIntervalButton = (props: Omit<React.ComponentProps<typeof Button>, 'children'>) => {
  const { className, onClick, ...rest } = props;

  return (
    <Button
      {...rest}
      className={classNames('RemoveTimeIntervalButton', className)}
      onClick={onClick}
      disabled={!onClick}
    >
      <MinusIcon className="RemoveTimeIntervalButton__icon" />
    </Button>
  );
};

export default React.memo(RemoveTimeIntervalButton);
