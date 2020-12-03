import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactSwitch from '../../ReactSwitch';
import './FormikSwitchField.scss';

const SwitchField = (props) => {
  const {
    field,
    form: { setFieldValue },
    onChange,
    label,
    wrapperClassName,
    id,
    position,
  } = props;

  const onClick = () => {
    setFieldValue(field.name, !field.value);
    onChange(props);
  };

  return (
    <div
      className={classNames('FormikSwitchField', {
        'FormikSwitchField--label-left': position === 'LABEL_LEFT',
      }, wrapperClassName)}
    >
      <div className="FormikSwitchField__inner">
        <ReactSwitch
          on={!!field.value}
          onClick={onClick}
          id={id}
          className="FormikSwitchField__trigger"
        />
        <button type="button" onClick={onClick}>
          {label}
        </button>
      </div>
    </div>
  );
};

SwitchField.propTypes = {
  wrapperClassName: PropTypes.string,
  field: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  id: PropTypes.string,
  onChange: PropTypes.func,
  position: PropTypes.oneOf(['LABEL_LEFT', 'LABEL_RIGHT']),
};
SwitchField.defaultProps = {
  wrapperClassName: null,
  label: null,
  id: null,
  onChange: () => {},
  position: 'LABEL_RIGHT',
};

export default SwitchField;
