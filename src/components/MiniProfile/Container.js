import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

class Container extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    target: PropTypes.string.isRequired,
    dataSource: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  };
  static contextTypes = {
    miniProfile: PropTypes.shape({
      onShowMiniProfile: PropTypes.func.isRequired,
    }),
  };

  handleOnMouseOver = async () => {
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
        onMouseOver={this.handleOnMouseOver}
      >
        {children}
      </div>
    );
  }
}

export default Container;
