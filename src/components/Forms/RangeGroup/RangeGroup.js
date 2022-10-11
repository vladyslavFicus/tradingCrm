import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FieldLabel from '../FieldLabel';
import './RangeGroup.scss';

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
      <div className={classNames('RangeGroup', className)}>
        <FieldLabel className="RangeGroup__label" label={label} addon={labelAddon} />
        <div className="RangeGroup__container">
          <div>{fromElement}</div>
          <div className={classNames('RangeGroup__divider', dividerClassName)}>
            -
          </div>
          <div>{toElement}</div>
        </div>
      </div>
    );
  }
}

export default RangeGroup;
