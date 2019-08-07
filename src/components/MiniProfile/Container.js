import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';

class Container extends Component {
  static propTypes = {
    placement: PropTypes.string,
    children: PropTypes.node.isRequired,
    target: PropTypes.string.isRequired,
    dataSource: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    delay: PropTypes.shape({
      show: PropTypes.number,
      hide: PropTypes.number,
    }),
    id: PropTypes.string,
  };

  static contextTypes = {
    miniProfile: PropTypes.shape({
      onShowMiniProfile: PropTypes.func.isRequired,
    }),
  };

  static defaultProps = {
    delay: {
      show: 500,
      hide: 500,
    },
    id: null,
    placement: 'right',
  };

  id = this.props.id ? this.props.id.replace(/[[\]]/g, '') : v4().replace(/[0-9]/g, '');

  componentDidMount() {
    this.addTargetEvents();
  }

  componentWillUnmount() {
    this.removeTargetEvents();
    clearTimeout(this.showTimeout);
    clearTimeout(this.hideTimeout);
  }

  onMouseOver = () => {
    if (this.hideTimeout) {
      this.clearHideTimeout();
    }

    this.showTimeout = setTimeout(this.show, this.props.delay.show);
  };

  onMouseLeave = () => {
    if (this.showTimeout) {
      this.clearShowTimeout();
    }
    this.hideTimeout = setTimeout(this.hide, this.props.delay.hide);
  };

  onMouseEnterPopover = () => {
    if (this.hideTimeout) {
      this.clearHideTimeout();
    }
  };

  addTargetEvents = () => {
    this.target.addEventListener('mouseover', this.onMouseOver, true);
    this.target.addEventListener('mouseout', this.onMouseLeave, true);
  };

  removeTargetEvents = () => {
    this.target.removeEventListener('mouseover', this.onMouseOver, true);
    this.target.removeEventListener('mouseout', this.onMouseLeave, true);
  };

  show = () => this.loadContent();

  hide = () => this.context.miniProfile.onHideMiniProfile();

  loadContent = async () => {
    const {
      props: { dataSource, target, type, placement },
      context: { miniProfile: { onShowMiniProfile } },
      id,
      onMouseEnterPopover,
      onMouseLeave,
    } = this;

    const popoverMouseEvents = {
      enter: onMouseEnterPopover,
      leave: onMouseLeave,
    };

    if (typeof dataSource === 'function') {
      const action = await dataSource(target);

      if (action && !action.error) {
        onShowMiniProfile(`${id}-${target}`, action.payload, type, popoverMouseEvents, placement);
      }
    } else {
      onShowMiniProfile(`${id}-${target}`, dataSource, type, popoverMouseEvents, placement);
    }
  };

  clearShowTimeout() {
    clearTimeout(this.showTimeout);
    this.showTimeout = null;
  }

  clearHideTimeout() {
    clearTimeout(this.hideTimeout);
    this.hideTimeout = null;
  }

  render() {
    const { children, target } = this.props;

    return (
      <span
        className="d-inline-block"
        id={`${this.id}-${target}`}
        ref={(node) => {
          this.target = node;
        }}
      >
        {children}
      </span>
    );
  }
}

export default Container;
