import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FieldLabel from './FieldLabel';

const RangeGroup = ({ label, labelAddon, children, className, dividerClassName }) => {
  const [fromElement, toElement] = React.Children.toArray(children);

  return (
    <div className={classNames('form-group', className)}>
      <FieldLabel label={label} addon={labelAddon} />
      <div className="row no-gutters range-group">
        <div className="col">
          {fromElement}
        </div>
        <div
          className={classNames(
            'col-auto px-2 range-group__divider',
            dividerClassName,
          )}
        >
          -
        </div>
        <div className="col">
          {toElement}
        </div>
      </div>
    </div>
  );
};

RangeGroup.propTypes = {
  label: PropTypes.string,
  labelAddon: PropTypes.any,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  className: PropTypes.string,
  dividerClassName: PropTypes.string,
};

RangeGroup.defaultProps = {
  label: null,
  labelAddon: null,
  className: null,
  dividerClassName: null,
};

export default RangeGroup;
