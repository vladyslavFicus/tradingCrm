import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClipboardContainer from 'react-copy-to-clipboard';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import './CopyToClipboard.scss';

class CopyToClipboard extends Component {
  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.string,
    children: PropTypes.node.isRequired,
    notificationLevel: PropTypes.oneOf(['info', 'warning', 'success']),
    notificationTitle: PropTypes.string,
    notificationMessage: PropTypes.string.isRequired,
    notify: PropTypes.bool,
  };
  static defaultProps = {
    className: 'copy-clipboard-container',
    notify: false,
    notificationLevel: 'info',
    notificationTitle: I18n.t('COMMON.NOTIFICATIONS.COPIED'),
    notificationMessage: 'Full UUID has been copied to clipboard',
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  state = {
    highlight: false,
  };

  toggle = () => {
    this.setState({
      highlight: !this.state.highlight,
    });
  };

  animate = () => {
    this.toggle();
    setTimeout(this.toggle, 1000);
  };

  handleCopy = () => {
    const { addNotification } = this.context;
    const {
      notificationLevel,
      notificationTitle,
      notificationMessage,
      notify,
    } = this.props;

    this.animate();

    if (notify) {
      addNotification({
        level: notificationLevel,
        title: notificationTitle,
        message: notificationMessage,
      });
    }
  };

  render() {
    const { className, children, text } = this.props;
    const { highlight } = this.state;

    return (
      <span className={classNames(className, { highlight })}>
        <ClipboardContainer text={text} onCopy={this.handleCopy}>
          {children}
        </ClipboardContainer>
      </span>
    );
  }
}

export default CopyToClipboard;
