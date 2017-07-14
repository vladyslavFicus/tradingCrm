import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Preloader extends React.Component {
  constructor(props) {
    super();
    this.state = { display: props.show ? 'block' : 'none' };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.show !== nextProps.show) {
      if (nextProps.show) {
        this.setState({ display: 'block' });
      } else {
        setTimeout(() => this.setState({ display: 'none' }), 100);
      }
    }
  }

  render() {
    const { display } = this.state;
    const { show } = this.props;

    return (
      <div className={classNames('preloader', { fade: !show })} style={{ display }}>
        <div className="loader" />
      </div>
    );
  }
}

Preloader.propTypes = {
  show: PropTypes.bool,
};
Preloader.defaultProps = {
  show: false,
};

export default Preloader;
