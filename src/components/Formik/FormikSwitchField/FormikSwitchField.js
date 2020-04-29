import React from 'react';
import PropTypes from 'prop-types';
import ReactSwitch from '../../ReactSwitch';

const SwitchField = (props) => {
  const {
    field,
    form: { setFieldValue },
    onChange,
    label,
    wrapperClassName,
    id,
  } = props;

  const onClick = () => {
    setFieldValue(field.name, !field.value);
    onChange(props);
  };

  return (
    <div className={wrapperClassName}>
      <ReactSwitch
        on={!!field.value}
        onClick={onClick}
        id={id}
      />
      <button type="button" className="note-popover__pin-label" onClick={onClick}>
        {label}
      </button>
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
};
SwitchField.defaultProps = {
  wrapperClassName: null,
  label: null,
  id: null,
  onChange: () => {},
};

export default SwitchField;
