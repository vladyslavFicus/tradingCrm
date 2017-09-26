import React, { PropTypes, Component } from 'react';

class Container extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    target: PropTypes.string.isRequired,
    dataSource: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    delay: PropTypes.shape({
      show: PropTypes.number,
      hide: PropTypes.number,
    }),
  };
  static defaultProps = {
    delay: {
      show: 500,
      hide: 500,
    },
  };
  static contextTypes = {
    miniProfile: PropTypes.shape({
      onShowMiniProfile: PropTypes.func.isRequired,
    }),
  };

  componentDidMount() {
    this.addTargetEvents();
  }

  componentWillUnmount() {
    this.removeTargetEvents();
    clearTimeout(this.showTimeout);
    clearTimeout(this.hideTimeout);
  }

  addTargetEvents = () => {
    this.target.addEventListener('mouseover', this.onMouseOver, true);
    this.target.addEventListener('mouseout', this.onMouseLeave, true);
  };

  removeTargetEvents = () => {
    this.target.removeEventListener('mouseover', this.onMouseOver, true);
    this.target.removeEventListener('mouseout', this.onMouseLeave, true);
  };

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

  clearShowTimeout() {
    clearTimeout(this.showTimeout);
    this.showTimeout = null;
  }

  clearHideTimeout() {
    clearTimeout(this.hideTimeout);
    this.hideTimeout = null;
  }

  show = () => this.loadContent();

  hide = () => this.context.miniProfile.onHideMiniProfile();

  onMouseEnterPopover = () => {
    if (this.hideTimeout) {
      this.clearHideTimeout();
    }
  };

  loadContent = async () => {
    const { dataSource, target, type } = this.props;
    const { miniProfile: { onShowMiniProfile } } = this.context;

    const popoverMouseEvents = {
      enter: this.onMouseEnterPopover,
      leave: this.onMouseLeave,
    };

    if (typeof dataSource === 'function') {
      const action = await dataSource(target);

      if (action && !action.error) {
        onShowMiniProfile(`id-${target}`, action.payload, type, popoverMouseEvents);
      }
    } else {
      onShowMiniProfile(`id-${target}`, dataSource, type, popoverMouseEvents);
    }
  };

  render() {
    const { children, target } = this.props;

    return (
      <div
        className="mini-profile-show-button"
        id={`id-${target}`}
        ref={(node) => {
          this.target = node;
        }}
      >
        {children}
      </div>
    );
  }
}

export default Container;
