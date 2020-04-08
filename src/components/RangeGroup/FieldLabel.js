import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const FieldLabel = ({ label, addon, className }) => (
  <If condition={label}>
    <Choose>
      <When condition={addon}>
        <div className={classNames('row no-gutters', className)}>
          <label className="col">{label}</label>
          <div className="col-auto pl-1">
            {addon}
          </div>
        </div>
      </When>
      <Otherwise>
        <label>{label}</label>
      </Otherwise>
    </Choose>
  </If>
);

FieldLabel.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  addon: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
  className: PropTypes.string,
};
FieldLabel.defaultProps = {
  label: null,
  addon: null,
  className: null,
};

export default FieldLabel;
