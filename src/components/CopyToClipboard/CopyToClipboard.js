import React, { Component, PropTypes } from 'react';
import ClipboardContainer from 'react-copy-to-clipboard';
import classNames from 'classnames';
import './CopyToClipboard.scss';

class CopyToClipboard extends Component {
  static propTypes = {
    onCopy: PropTypes.func.isRequired,
    text: PropTypes.string,
    children: PropTypes.node.isRequired,
  };

  state = {
    highlight: false,
  };

  toggle = () => {
    this.setState({
      highlight: !this.state.highlight,
    });
  }

  animate = () => {
    this.toggle();
    setTimeout(this.toggle, 1000);
  }

  handleCopy = () => {
    this.props.onCopy();
    this.animate();
  }

  render() {
    const { children, text } = this.props;
    const { highlight } = this.state;

    return (
      <span className={classNames('copy-clipboard-container', { highlight })}>
        <ClipboardContainer
          text={text}
          onCopy={this.handleCopy}
        >
          {children}
        </ClipboardContainer>
      </span>
    );
  }
}

export default CopyToClipboard;
