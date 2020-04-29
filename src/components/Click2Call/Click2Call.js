import React, { PureComponent } from 'react';
import { getClickToCall } from 'config';
import I18n from 'i18n-js';
import { compose, graphql } from 'react-apollo';
import ToolTip from 'react-portal-tooltip';
import PropTypes from 'constants/propTypes';
import withNotifications from 'hoc/withNotifications';
import { clickToCall } from 'graphql/mutations/profile';
import { createCall } from 'graphql/mutations/asterisk';
import { ReactComponent as PhoneSVG } from './icons/phone.svg';
import didlogic from './icons/didlogic.png';
import asterisk from './icons/asterisk.png';
import './Click2Call.scss';

const TOOLTIP_STYLE = {
  arrowStyle: {
    color: '#fff',
    borderColor: false,
    marginTop: '-12px',
    left: '-12px',
  },
};

class Click2Call extends PureComponent {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    clickToCall: PropTypes.func.isRequired,
    asteriskCreateCall: PropTypes.func.isRequired,
  };

  state = {
    isOpen: false,
  };

  id = `ClickToCall-${Math.random().toString(36).slice(2)}`;

  /**
   * Check if Didlogic enabled only
   *
   * @return {*|boolean}
   */
  isDidlogicOnly = () => {
    const _clickToCall = getClickToCall();

    return _clickToCall.isActive && !_clickToCall.asterisk.isActive;
  };

  handleDidLogicCall = async () => {
    const { notify, number } = this.props;

    const { data: { profile: { clickToCall: { success } } } } = await this.props.clickToCall(
      {
        variables: {
          number,
        },
      },
    );

    if (!success) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.CLICK_TO_CALL_FAILED'),
      });
    }
  };

  handleAsteriskCall = prefix => async () => {
    const { notify, number } = this.props;

    const { data: { asterisk: { createCall: { success } } } } = await this.props.asteriskCreateCall(
      {
        variables: {
          number,
          prefix,
        },
      },
    );

    if (!success) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.CLICK_TO_CALL_FAILED'),
      });
    }
  };

  handleMouseEnter = () => {
    // Show tooltip with additional click2call providers if not only didlogic enabled
    if (!this.isDidlogicOnly()) {
      this.setState({ isOpen: true });
    }
  };

  handleMouseLeave = () => {
    this.setState({ isOpen: false });
  };

  /**
   * Handle click on phone icon
   */
  handlePhoneClick = () => {
    // If didlogic enabled only --> execute handler by click, in other cases do nothing
    if (this.isDidlogicOnly()) {
      this.handleDidLogicCall();
    }
  };

  render() {
    const { isOpen } = this.state;

    const _clickToCall = getClickToCall();
    const isActive = _clickToCall.isActive || _clickToCall.asterisk.isActive;

    return (
      <If condition={isActive}>
        <PhoneSVG
          id={this.id}
          onClick={this.handlePhoneClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
        <ToolTip
          parent={`#${this.id}`}
          active={isOpen}
          position="right"
          arrow="top"
          style={TOOLTIP_STYLE}
        >
          <div className="Click2Call__submenu">
            <If condition={_clickToCall.isActive}>
              <div
                className="Click2Call__submenu-item Click2Call__didlogic"
                onClick={this.handleDidLogicCall}
              >
                <img src={didlogic} alt="" />
              </div>
            </If>

            <If condition={_clickToCall.asterisk.isActive}>
              <div className="Click2Call__asterisk">
                <img className="Click2Call__asterisk-image" src={asterisk} alt="" />
                <div className="Click2Call__asterisk-prefixes">
                  {Object.keys(_clickToCall.asterisk.prefixes).map(prefix => (
                    <span
                      key={prefix}
                      className="Click2Call__asterisk-prefix"
                      onClick={this.handleAsteriskCall(_clickToCall.asterisk.prefixes[prefix])}
                    >
                      {prefix}
                    </span>
                  ))}
                </div>
              </div>
            </If>
          </div>
        </ToolTip>
      </If>
    );
  }
}

export default compose(
  withNotifications,
  graphql(clickToCall, { name: 'clickToCall' }),
  graphql(createCall, { name: 'asteriskCreateCall' }),
)(Click2Call);
