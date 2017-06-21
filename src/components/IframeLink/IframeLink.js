import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from '../../constants/propTypes';
import { actionCreators as windowActionCreators } from '../../redux/modules/window';

class IframeLink extends Component {
  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  };
  state = { isFrameVersion: window && window.parent !== window && window.parent.postMessage };

  handleClick = (e) => {
    if (this.state.isFrameVersion) {
      e.stopPropagation();
      e.preventDefault();

      window.parent.postMessage(JSON.stringify(windowActionCreators.navigateTo(this.props.to)), window.location.origin);
    }
  };

  render() {
    return <Link {...this.props} onClick={this.handleClick} />;
  }
}

export default IframeLink;
