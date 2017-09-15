import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

class Container extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    target: PropTypes.string.isRequired,
    dataSource: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    showDelay: PropTypes.number,
  };
  static defaultProps = {
    showDelay: 500,
  };
  static contextTypes = {
    miniProfile: PropTypes.shape({
      onShowMiniProfile: PropTypes.func.isRequired,
    }),
  };

  componentDidMount() {
    this.target = document.getElementById(`id-${this.props.target}`);
    this.target.addEventListener('mouseover', this.onMouseOver, true);
    this.target.addEventListener('mouseout', this.onMouseLeave, true);
  }

  componentWillUnmount() {
    this.target.removeEventListener('mouseover', this.onMouseOver, true);
    this.target.removeEventListener('mouseout', this.onMouseLeave, true);
  }

  onMouseOver = () => {
    this.showTimeout = setTimeout(this.loadContent, this.props.showDelay);
  }

  onMouseLeave = () => {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }

  loadContent = async () => {
    const { dataSource, target, type } = this.props;
    const { miniProfile: { onShowMiniProfile } } = this.context;

    if (_.isFunction(dataSource)) {
      const action = await dataSource();

      if (action && !action.error) {
        onShowMiniProfile(`id-${target}`, action.payload, type);
      }
    } else {
      onShowMiniProfile(`id-${target}`, dataSource, type);
    }
  }

  render() {
    const { children, target } = this.props;

    return (
      <div
        className="mini-profile-show-button"
        id={`id-${target}`}
      >
        {children}
      </div>
    );
  }
}

export default Container;
