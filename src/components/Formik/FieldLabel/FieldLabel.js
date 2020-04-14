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
    className: '',
  };

  render() {
    const { label, addon, className } = this.props;

    return (
      <Choose>
        <When condition={label}>
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
        </When>
        <Otherwise>
          {null}
        </Otherwise>
      </Choose>
    );
  }
}

export default FieldLabel;