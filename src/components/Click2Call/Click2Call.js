import React, { PureComponent } from 'react';
import { getClickToCall } from 'config';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import ToolTip from 'react-portal-tooltip';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import withNotifications from 'hoc/withNotifications';
import DidlogicCreateCall from './graphql/DidlogicCreateCall';
import AsteriskCreateCall from './graphql/AsteriskCreateCall';
import CommpeakCreateCall from './graphql/CommpeakCreateCall';
import CoperatoCreateCall from './graphql/CoperatoCreateCall';
import { ReactComponent as PhoneSVG } from './icons/phone.svg';
import didlogicIcon from './icons/didlogic.png';
import asteriskIcon from './icons/asterisk.png';
import commpeakIcon from './icons/commpeak.png';
import coperatoIcon from './icons/coperato.png';
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
    commpeakCreateCall: PropTypes.func.isRequired,
    coperatoCreateCall: PropTypes.func.isRequired,
    uuid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['PROFILE', 'LEAD']).isRequired,
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

    return _clickToCall.isActive
      && !_clickToCall.asterisk.isActive
      && !_clickToCall.commpeak.isActive
      && !_clickToCall.coperato.isActive;
  };

  handleDidLogicCall = async () => {
    const { notify, uuid, field, type } = this.props;

    try {
      await this.props.clickToCall({ variables: { uuid, field, type } });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.CLICK_TO_CALL_FAILED'),
      });
    }
  };

  handleAsteriskCall = prefix => async () => {
    const { notify, uuid, field, type } = this.props;

    try {
      await this.props.asteriskCreateCall({ variables: { uuid, field, type, prefix } });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.CLICK_TO_CALL_FAILED'),
      });
    }
  };

  handleCommpeakCall = prefix => async () => {
    const { notify, uuid, field, type } = this.props;

    try {
      await this.props.commpeakCreateCall({ variables: { uuid, field, type, prefix } });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.CLICK_TO_CALL_FAILED'),
      });
    }
  };

  handleCoperatoCall = prefix => async () => {
    const { notify, uuid, field, type } = this.props;

    try {
      await this.props.coperatoCreateCall({ variables: { uuid, field, type, prefix } });
    } catch (e) {
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

    const isActive = [
      _clickToCall.isActive,
      _clickToCall.asterisk.isActive,
      _clickToCall.commpeak.isActive,
      _clickToCall.coperato.isActive,
    ].includes(true);

    return (
      <If condition={isActive}>
        <PhoneSVG
          id={this.id}
          onClick={this.handlePhoneClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          className="Click2Call__icon"
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
                className="Click2Call__submenu-item"
                onClick={this.handleDidLogicCall}
              >
                <img src={didlogicIcon} alt="" />
              </div>
            </If>

            <If condition={_clickToCall.asterisk.isActive}>
              <div className="Click2Call__submenu-item Click2Call__submenu-item--no-hover">
                <img className="Click2Call__submenu-item-image" src={asteriskIcon} alt="" />
                <div className="Click2Call__submenu-item-prefixes">
                  {Object.keys(_clickToCall.asterisk.prefixes).map(prefix => (
                    <span
                      key={prefix}
                      className="Click2Call__submenu-item-prefix"
                      onClick={this.handleAsteriskCall(_clickToCall.asterisk.prefixes[prefix])}
                    >
                      {prefix}
                    </span>
                  ))}
                </div>
              </div>
            </If>

            <If condition={_clickToCall.commpeak.isActive}>
              <div className="Click2Call__submenu-item Click2Call__submenu-item--no-hover">
                <img className="Click2Call__submenu-item-image" src={commpeakIcon} alt="" />
                <div className="Click2Call__submenu-item-prefixes">
                  {Object.keys(_clickToCall.commpeak.prefixes).map(prefix => (
                    <span
                      key={prefix}
                      className="Click2Call__submenu-item-prefix"
                      onClick={this.handleCommpeakCall(_clickToCall.commpeak.prefixes[prefix])}
                    >
                      {prefix}
                    </span>
                  ))}
                </div>
              </div>
            </If>

            <If condition={_clickToCall.coperato.isActive}>
              <div className="Click2Call__submenu-item Click2Call__submenu-item--no-hover">
                <img className="Click2Call__submenu-item-image" src={coperatoIcon} alt="" />
                <div className="Click2Call__submenu-item-prefixes">
                  {Object.keys(_clickToCall.coperato.prefixes).map(prefix => (
                    <span
                      key={prefix}
                      className="Click2Call__submenu-item-prefix"
                      onClick={this.handleCoperatoCall(_clickToCall.coperato.prefixes[prefix])}
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
  withRequests({
    clickToCall: DidlogicCreateCall,
    asteriskCreateCall: AsteriskCreateCall,
    commpeakCreateCall: CommpeakCreateCall,
    coperatoCreateCall: CoperatoCreateCall,
  }),
)(Click2Call);
