import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './preloader.scss';

class Preloader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: props.isVisible ? 'block' : 'none',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isVisible !== nextProps.isVisible) {
      if (nextProps.isVisible) {
        this.setState({ display: 'block' });
      } else {
        this.timerID = setTimeout(() => this.setState({ display: 'none' }), 200);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timerID);
  }

  render() {
    const { display } = this.state;
    const { isVisible } = this.props;

    return (
      <div className={classNames('preloader', { 'is-fading': !isVisible })} style={{ display }}>
        <div className="preloader__item" />
      </div>
    );
  }
}

Preloader.propTypes = {
  isVisible: PropTypes.bool,
};

Preloader.defaultProps = {
  isVisible: false,
};

export default Preloader;
