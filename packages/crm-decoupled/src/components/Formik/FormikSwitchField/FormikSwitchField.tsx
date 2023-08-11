import React from 'react';
import classNames from 'classnames';
import { Types } from '@crm/common';
import { FieldProps } from 'formik';
import { DefaultFieldProps } from '../types';
import ReactSwitch from '../../ReactSwitch';
import './FormikSwitchField.scss';

type Props = DefaultFieldProps & {
  wrapperClassName?: string,
  labelPosition?: Types.Position,
  id?: string,
  stopPropagation?: boolean,
};

const FormikSwitchField = (props: Props & FieldProps) => {
  const {
    field: {
      name,
      value,
      onChange = () => {},
    },
    form: { setFieldValue },
    label = '',
    wrapperClassName = null,
    id = '',
    ...rest
  } = props;

  const onClick = (on: boolean) => {
    setFieldValue(name, !value);

    onChange(on);
  };

  return (
    <div className={classNames('FormikSwitchField', wrapperClassName)}>
      <div className="FormikSwitchField__inner">
        <ReactSwitch
          on={!!value}
          onClick={onClick}
          id={id}
          label={label}
          {...rest}
        />
      </div>
    </div>
  );
};

export default React.memo(FormikSwitchField);
