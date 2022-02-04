import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class FieldLabel extends PureComponent {
  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    addon: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    className: PropTypes.string,
  };

  static defaultProps = {
    label: null,
    addon: null,
    className: null,
  };

  render() {
    const { label, addon, className } = this.props;

    return (
      <If condition={label}>
        <Choose>
          <When condition={addon}>
            <div className={classNames('row g-0', className)}>
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
  }
}

export default FieldLabel;
