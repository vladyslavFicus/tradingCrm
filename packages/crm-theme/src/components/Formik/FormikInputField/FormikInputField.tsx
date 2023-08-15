import React from 'react';
import { FormikInputField as Input } from '@crm/common';
import './FormikInputField.scss';

const FormikInputField = (props: any) => (
  <Input {...props} />
);

export default React.memo(FormikInputField);
