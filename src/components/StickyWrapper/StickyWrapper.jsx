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

  state = {
    mounted: false,
  };

  componentWillReceiveProps() {
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    const { children, top, innerZ, activeClass } = this.props;
    const { mounted } = this.state;

    return (
      <Sticky
        enabled={mounted}
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
