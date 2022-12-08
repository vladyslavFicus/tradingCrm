import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import ClipboardContainer from 'react-copy-to-clipboard';
import classNames from 'classnames';
import { notify, LevelType } from 'providers/NotificationProvider';
import './CopyToClipboard.scss';

class CopyToClipboard extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    withNotification: PropTypes.bool,
    notificationLevel: PropTypes.oneOf([LevelType.INFO, LevelType.WARNING, LevelType.SUCCESS]),
    notificationTitle: PropTypes.string,
    notificationMessage: PropTypes.string,
  };

  static defaultProps = {
    className: null,
    withNotification: false,
    notificationLevel: LevelType.INFO,
    notificationTitle: null,
    notificationMessage: null,
  };

  timerID = null;

  state = {
    highlight: false,
  };

  componentWillUnmount() {
    clearTimeout(this.timerID);
  }

  toggle = () => {
    this.setState(({ highlight }) => ({ highlight: !highlight }));
  };

  animate = () => {
    this.toggle();

    this.timerID = setTimeout(this.toggle, 1000);
  };

  handleCopy = () => {
    const {
      withNotification,
      notificationLevel,
      notificationTitle,
      notificationMessage,
    } = this.props;

    this.animate();

    if (withNotification) {
      notify({
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

    const mainClassName = classNames('CopyToClipboard', className, {
      'CopyToClipboard--highlight': highlight,
    });

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
