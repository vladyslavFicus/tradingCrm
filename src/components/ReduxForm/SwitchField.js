import React from 'react';
import PropTypes from 'prop-types';
import ReactSwitch from '../ReactSwitch';

const SwitchField = (props) => {
  const {
    input,
    label,
    wrapperClassName,
    id,
  } = props;

  const onClick = () => input.onChange(!input.value);

  return (
    <div className={wrapperClassName}>
      <ReactSwitch
        on={!!input.value}
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
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  id: PropTypes.string,
};
SwitchField.defaultProps = {
  wrapperClassName: null,
  label: null,
  id: null,
};

export default SwitchField;
