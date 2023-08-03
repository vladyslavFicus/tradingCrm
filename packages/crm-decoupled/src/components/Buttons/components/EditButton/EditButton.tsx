import React from 'react';
import classNames from 'classnames';
import Button from 'components/Buttons/Button';
import { ReactComponent as EditIcon } from './icon-edit.svg';
import './EditButton.scss';

const EditButton = (props: Omit<React.ComponentProps<typeof Button>, 'children'>) => {
  const { className = '', disabled, ...rest } = props;

  return (
    <Button
      {...rest}
      icon
      disabled={disabled}
      className={classNames('EditButton', { 'EditButton--disabled': disabled }, className)}
    >
      <EditIcon className="EditButton__icon" />
    </Button>
  );
};

export default React.memo(EditButton);
