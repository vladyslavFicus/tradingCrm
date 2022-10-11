import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './CircleLoader.scss';

class CircleLoader extends PureComponent {
  static propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    overlayColor: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    size: 20,
    color: 'var(--accent)',
    overlayColor: 'var(--divider)',
    className: null,
  };

  render() {
    const { size, color, overlayColor, className } = this.props;

    const style = {
      width: size,
      height: size,
      border: `${size / 9}px solid ${overlayColor}`,
      borderTop: `${size / 9}px solid ${color}`,
    };

    return <div data-testid="CircleLoader" className={classNames('CircleLoader', className)} style={style} />;
  }
}

export default CircleLoader;
