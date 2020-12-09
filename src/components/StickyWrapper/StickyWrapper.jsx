import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-stickynode';

// # Will be removed after ClientProfile refactoring
class StickyWrapper extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    top: PropTypes.oneOfType([
      PropTypes.string, PropTypes.number,
    ]).isRequired,
    innerZ: PropTypes.number,
    activeClass: PropTypes.string,
  };

  static defaultProps = {
    innerZ: 2,
    activeClass: 'active',
  };

  render() {
    const { children, top, innerZ, activeClass } = this.props;

    return (
      <Sticky
        enabled
        top={top}
        bottomBoundary={0}
        innerZ={innerZ}
        activeClass={activeClass}
      >
        {children}
      </Sticky>
    );
  }
}

export default StickyWrapper;
