import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';

class Placeholder extends Component {
  static propTypes = {
    ready: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.any,
  };
  static defaultProps = {
    children: null,
    ready: false,
    className: 'animated-background',
    color: '#F0F0F0',
  };

  render() {
    const { children, ...rest } = this.props;

    return (
      <ReactPlaceholder {...rest}>
        {children}
      </ReactPlaceholder>
    );
  }
}

export default Placeholder;
