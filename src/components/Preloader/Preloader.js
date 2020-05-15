import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Preloader.scss';

class Preloader extends PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool,
  };

  static defaultProps = {
    isVisible: false,
  };

  render() {
    const { isVisible } = this.props;

    return (
      <div
        className={
          classNames('Preloader', {
            'Preloader--fading': !isVisible,
            'Preloader--invisible': !isVisible,
          })
        }
      >
        <div className="Preloader__item" />
      </div>
    );
  }
}

export default Preloader;
