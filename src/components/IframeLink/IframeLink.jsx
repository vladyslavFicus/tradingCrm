import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from '../../constants/propTypes';
import { actionCreators as windowActionCreators } from '../../redux/modules/window';

class IframeLink extends Component {
  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  };

  state = { isFrameVersion: window.isFrame };

  handleClick = (e) => {
    if (this.state.isFrameVersion) {
      e.stopPropagation();
      e.preventDefault();

      window.dispatchAction(windowActionCreators.navigateTo(this.props.to));
    }
  };

  render() {
    return <Link {...this.props} onClick={this.handleClick} />;
  }
}

export default IframeLink;
