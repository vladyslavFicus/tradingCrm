import React from 'react';
import classNames from 'classnames';
import { Button } from 'components/Buttons';
import { ReactComponent as CloseIcon } from './close-icon.svg';
import './RemoveBoardButton.scss';

const RemoveBoardButton = (props: Omit<React.ComponentProps<typeof Button>, 'children'>) => {
  const { className, onClick, ...rest } = props;

  return (
    <Button
      {...rest}
      className={classNames('RemoveBoardButton', className)}
      onClick={onClick}
      disabled={!onClick}
    >
      <CloseIcon className="RemoveBoardButton__icon" />
    </Button>
  );
};

export default React.memo(RemoveBoardButton);
