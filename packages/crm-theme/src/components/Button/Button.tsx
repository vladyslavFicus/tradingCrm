import React from 'react';
import { Button as DefaultButton } from '@crm/common';
import './Button.scss';

const Button = (props: React.ComponentProps<typeof DefaultButton>) => {
  const { children, ...rest } = props;

  return (
    <DefaultButton {...rest}>
      {children}
    </DefaultButton>
  );
};

export default React.memo(Button);
