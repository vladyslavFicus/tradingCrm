import React, { Component, PropTypes } from 'react';
import ClipboardContainer from 'react-copy-to-clipboard';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import './CopyToClipboard.scss';

class CopyToClipboard extends Component {
  static propTypes = {
    text: PropTypes.string,
    children: PropTypes.node.isRequired,
    notificationMessage: PropTypes.string.isRequired,
    notify: PropTypes.bool,
  };
  static defaultProps = {
    notify: false,
    notificationMessage: 'Full UUID has been copied to clipboard',
  };
  static contextTypes = {
    onAddNotification: PropTypes.func.isRequired,
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
    const { onAddNotification } = this.context;
    const { notificationMessage, notify } = this.props;

    this.animate();

    if (notify) {
      onAddNotification({
        level: 'info',
        title: I18n.t('COMMON.NOTIFICATIONS.COPIED'),
        message: notificationMessage,
      });
    }
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
