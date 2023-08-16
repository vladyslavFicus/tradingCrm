import React from 'react';
import { FormikInputField as DefaultInput } from '@crm/common';
import './FormikInputField.scss';

const FormikInputField = (props: React.ComponentProps<typeof DefaultInput>) => (
  <DefaultInput {...props} />
);

export default React.memo(FormikInputField);
