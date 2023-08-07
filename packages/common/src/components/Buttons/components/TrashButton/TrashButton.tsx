import React from 'react';
import classNames from 'classnames';
import Button from '../../Button';
import './TrashButton.scss';

const TrashButton = (props: Omit<React.ComponentProps<typeof Button>, 'children'>) => {
  const { className, disabled, onClick, ...rest } = props;

  return (
    <Button
      {...rest}
      disabled={disabled}
      className={classNames('TrashButton', { 'TrashButton--disabled': disabled }, className)}
      onClick={onClick}
    >
      <i className="TrashButton__icon fa fa-trash" />
    </Button>
  );
};

export default React.memo(TrashButton);
