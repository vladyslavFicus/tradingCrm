import React from 'react';
import { get } from 'lodash';
import HtmlEditor from 'components/HtmlEditor';

type Form = {
  errors: object,
  initialValues?: object,
  touched: object,
  setFieldValue: (name: string, value: string) => void,
};

type Field = {
  name: string,
  value?: string | number,
  onChange: () => void,
};

type Props = {
  form: Form,
  field: Field,
};

const FormikHtmlEditorField = (props: Props) => {
  const {
    form: {
      errors,
      touched,
      initialValues,
      setFieldValue,
    },
    field: {
      name,
      value,
    },
  } = props;

  const isErrorMessageVisible = get(initialValues, name) === undefined || get(touched, name);

  const onChange = (newValue: string) => {
    setFieldValue(name, newValue);
  };

  return (
    <HtmlEditor
      value={value}
      error={isErrorMessageVisible && get(errors, name)}
      onChange={onChange}
    />
  );
};

export default React.memo(FormikHtmlEditorField);
