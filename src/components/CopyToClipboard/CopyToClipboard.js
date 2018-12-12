import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import ClipboardContainer from 'react-copy-to-clipboard';
import classNames from 'classnames';
import './CopyToClipboard.scss';

class CopyToClipboard extends Component {
  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    notificationLevel: PropTypes.oneOf(['info', 'warning', 'success']),
    notificationTitle: PropTypes.string.isRequired,
    notificationMessage: PropTypes.string.isRequired,
    notify: PropTypes.bool,
  };
  static defaultProps = {
    className: null,
    notify: false,
    notificationLevel: 'info',
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  state = {
    highlight: false,
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  toggle = () => {
    if (this.mounted) {
      this.setState({
        highlight: !this.state.highlight,
      });
    }
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
        title: I18n.t(notificationTitle),
        message: I18n.t(notificationMessage),
      });
    }
  };

  handleClick = (e) => {
    e.stopPropagation();
  };

  render() {
    const { className, children, text } = this.props;
    const { highlight } = this.state;

    const mainClassName = classNames(
      'copy-clipboard-container',
      className,
      { highlight },
    );

    return (
      <span onClick={this.handleClick} className={mainClassName}>
        <ClipboardContainer text={text} onCopy={this.handleCopy}>
          {children}
        </ClipboardContainer>
      </span>
    );
  }
}

export default CopyToClipboard;
