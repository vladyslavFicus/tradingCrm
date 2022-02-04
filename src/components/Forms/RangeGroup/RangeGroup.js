import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FieldLabel from '../FieldLabel';

class RangeGroup extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    labelAddon: PropTypes.any,
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    className: PropTypes.string,
    dividerClassName: PropTypes.string,
  };

  static defaultProps = {
    label: null,
    labelAddon: null,
    className: null,
    dividerClassName: null,
  };

  render() {
    const {
      children,
      label,
      labelAddon,
      className,
      dividerClassName,
    } = this.props;

    const [fromElement, toElement] = React.Children.toArray(children);

    return (
      <div className={classNames('form-group', className)}>
        <FieldLabel label={label} addon={labelAddon} />
        <div className="row g-0 range-group">
          <div className="col">{fromElement}</div>
          <div
            className={classNames(
              'col-auto px-2 range-group__divider',
              dividerClassName,
            )}
          >
            -
          </div>
          <div className="col">{toElement}</div>
        </div>
      </div>
    );
  }
}

export default RangeGroup;
