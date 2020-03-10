import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './GridCheckbox.scss';

class GridCheckbox extends PureComponent {
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    withoutCheckIcon: PropTypes.bool,
  };

  static defaultProps = {
    withoutCheckIcon: false,
  };

  handleClick = (event) => {
    event.stopPropagation();
    this.props.onChange();
  };

  render() {
    const { isActive, withoutCheckIcon } = this.props;

    return (
      <div
        className={
          classNames(
            'GridCheckbox',
            { 'GridCheckbox--is-active': isActive },
            { 'GridCheckbox--without-check': withoutCheckIcon },
          )
        }
        onClick={this.handleClick}
      />
    );
  }
}

export default GridCheckbox;
