import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import getTimeOfDay from '../../utils/getTimeOfDay';

class Greeting extends Component {
  renderTimeOfDay() {
    return getTimeOfDay([
      I18n.t('COMMON.GOOD_MORNING'),
      I18n.t('COMMON.GOOD_AFTERNOON'),
      I18n.t('COMMON.GOOD_EVENING'),
      I18n.t('COMMON.GOOD_NIGHT'),
    ]);
  }

  render() {
    const { username, className, usernameClassName } = this.props;

    return (
      <span className={className}>
        {this.renderTimeOfDay()}, <span className={usernameClassName}>{username}</span>!
      </span>
    );
  }
}

Greeting.propTypes = {
  username: PropTypes.string.isRequired,
  className: PropTypes.string,
  usernameClassName: PropTypes.string,
};
Greeting.defaultProps = {
  className: 'greeting',
  usernameClassName: 'font-weight-600',
};

export default Greeting;
