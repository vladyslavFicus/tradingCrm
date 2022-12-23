import React from 'react';
import classNames from 'classnames';
import { Button } from 'components/UI';
import './TrashButton.scss';

type Props = {
  className?: string,
  disabled?: boolean,
  onClick?: () => void,
};

const TrashButton = (props: Props) => {
  const { className, disabled, onClick } = props;

  return (
    <Button
      disabled={disabled}
      className={classNames('TrashButton', { 'TrashButton--disabled': disabled }, className)}
      onClick={onClick}
    >
      <i className="TrashButton__icon fa fa-trash" />
    </Button>
  );
};

export default React.memo(TrashButton);
