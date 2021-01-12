import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import ClipboardContainer from 'react-copy-to-clipboard';
import classNames from 'classnames';
import { withNotifications } from 'hoc';
import customTimeout from 'utils/customTimeout';
import './CopyToClipboard.scss';

class CopyToClipboard extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    withNotification: PropTypes.bool,
    notificationLevel: PropTypes.oneOf(['info', 'warning', 'success']),
    notificationTitle: PropTypes.string,
    notificationMessage: PropTypes.string,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: null,
    withNotification: false,
    notificationLevel: 'info',
    notificationTitle: null,
    notificationMessage: null,
  };

  state = {
    highlight: false,
  };

  toggle = () => {
    this.setState(({ highlight }) => ({ highlight: !highlight }));
  };

  animate = () => {
    this.toggle();
    customTimeout(this.toggle, 1000);
  };

  handleCopy = () => {
    const {
      withNotification,
      notificationLevel,
      notificationTitle,
      notificationMessage,
      notify,
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

export default withNotifications(CopyToClipboard);
