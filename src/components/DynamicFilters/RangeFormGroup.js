import React from 'react';
import PropTypes from 'prop-types';
import FieldLabel from '../ReduxForm/FieldLabel';

const RangeFormGroup = ({ label, labelAddon, children }) => {
  const [fromElement, toElement] = React.Children.toArray(children);

  return (
    <div className="form-group">
      <FieldLabel label={label} addon={labelAddon} />
      <div className="range-group">
        {fromElement}
        <span className="range-group__separator">-</span>
        {toElement}
      </div>
    </div>
  );
};
RangeFormGroup.propTypes = {
  label: PropTypes.string,
  labelAddon: PropTypes.any,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};
RangeFormGroup.defaultProps = {
  label: null,
  labelAddon: null,
};

export default RangeFormGroup;
