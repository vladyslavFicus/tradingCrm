import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-stickynode';

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

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { children, top, innerZ, activeClass } = this.props;

    return (
      <Sticky
        enabled={this.mounted}
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
