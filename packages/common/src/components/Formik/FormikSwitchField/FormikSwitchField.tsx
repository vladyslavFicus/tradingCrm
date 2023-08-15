import React from 'react';
import classNames from 'classnames';
import { FieldProps } from 'formik';
import { Position } from '../../../types';
import { ReactSwitch } from '../../ReactSwitch';
import { DefaultFieldProps } from '../types';
import './FormikSwitchField.scss';

type Props = DefaultFieldProps & {
  wrapperClassName?: string,
  labelPosition?: Position,
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
