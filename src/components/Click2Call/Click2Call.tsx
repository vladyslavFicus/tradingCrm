import React, { useState, useMemo } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { debounce } from 'lodash';
import ToolTip from 'react-portal-tooltip';
import { getClickToCall } from 'config';
import { withNotifications } from 'hoc';
import { LevelType, Notify } from 'types';
import {
  Click2CallPhone__Type__Enum as PhoneType,
  Click2CallCustomer__Type__Enum as CustomerType,
} from '__generated__/types';
import { Click2CallProviders, ProviderOptionsType } from 'constants/Click2CallProviders';
import { useDidLogicCreateCallMutation } from './graphql/__generated__/DidlogicCreateCall';
import { useAsteriskCreateCallMutation } from './graphql/__generated__/AsteriskCreateCall';
import { useCommpeakCreateCallMutation } from './graphql/__generated__/CommpeakCreateCall';
import { useCoperatoCreateCallMutation } from './graphql/__generated__/CoperatoCreateCall';
import { ReactComponent as PhoneSVG } from './icons/phone.svg';
import didlogicIcon from './icons/didlogic.png';
import asteriskIcon from './icons/asterisk.png';
import commpeakIcon from './icons/commpeak.png';
import coperatoIcon from './icons/coperato.png';
import './Click2Call.scss';

const TOOLTIP_STYLE = {
  arrowStyle: {
    color: '#fff',
    borderColor: 'none',
    marginTop: '-12px',
    left: '-12px',
  },
};

type Props = {
  customerType: CustomerType,
  notify: Notify,
  phoneType: PhoneType,
  uuid: string,
}

const Click2Call = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const _clickToCall = getClickToCall();

  const id = useMemo(() => `ClickToCall-${Math.random().toString(36).slice(2)}`, []);

  const [didlogicCreateCall] = useDidLogicCreateCallMutation();
  const [asteriskCreateCall] = useAsteriskCreateCallMutation();
  const [commpeakCreateCall] = useCommpeakCreateCallMutation();
  const [coperatoCreateCall] = useCoperatoCreateCallMutation();

  const isActive = [
    _clickToCall.isActive,
    _clickToCall.asterisk.isActive,
    _clickToCall.commpeak.isActive,
    _clickToCall.coperato.isActive,
  ].includes(true);

  /**
   * Check if Didlogic enabled only
   *
   * @return {*|boolean}
   */
  const isDidlogicOnly = () => _clickToCall.isActive
    && !_clickToCall.asterisk.isActive
    && !_clickToCall.commpeak.isActive
    && !_clickToCall.coperato.isActive;

  const handleCreateCall = (provider: Click2CallProviders, options?: ProviderOptionsType) => debounce(async () => {
    const { prefix = '' } = options || {};
    const { notify, uuid, phoneType, customerType } = props;

    try {
      switch (provider) {
        case Click2CallProviders.DIDLOGIC:
          await didlogicCreateCall({ variables: { uuid, phoneType, customerType } });
          break;
        case Click2CallProviders.ASTERISK:
          await asteriskCreateCall({ variables: { uuid, phoneType, customerType, prefix: prefix.toString() } });
          break;
        case Click2CallProviders.COMMPEAK:
          await commpeakCreateCall({ variables: { uuid, phoneType, customerType, prefix } });
          break;
        case Click2CallProviders.COPERATO:
          await coperatoCreateCall({ variables: { uuid, phoneType, customerType, prefix } });
          break;
        default: break;
      }
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.CLICK_TO_CALL_FAILED'),
      });
    }
  }, 3000, { leading: true, trailing: false });


  const handleMouseEnter = () => {
    // Show tooltip with additional click2call providers if not only didlogic enabled
    if (!isDidlogicOnly()) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  /**
   * Handle click on phone icon
   */
  const handlePhoneClick = () => {
    // If didlogic enabled only --> execute handler by click, in other cases do nothing
    if (isDidlogicOnly()) {
      handleCreateCall(Click2CallProviders.DIDLOGIC);
    }
  };

  return (
    <If condition={isActive}>
      <PhoneSVG
        id={id}
        onClick={handlePhoneClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="Click2Call__icon"
      />
      <ToolTip
        parent={`#${id}`}
        active={isOpen}
        position="right"
        arrow="top"
        style={TOOLTIP_STYLE}
      >
        <div className="Click2Call__submenu">
          <If condition={_clickToCall.isActive}>
            <div
              className="Click2Call__submenu-item"
              onClick={handleCreateCall(Click2CallProviders.DIDLOGIC)}
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
                    onClick={handleCreateCall(
                      Click2CallProviders.ASTERISK,
                      { prefix: _clickToCall.asterisk.prefixes[prefix] },
                    )}
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
                    onClick={handleCreateCall(
                      Click2CallProviders.COMMPEAK,
                      { prefix: _clickToCall.commpeak.prefixes[prefix] },
                    )}
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
                    onClick={handleCreateCall(
                      Click2CallProviders.COPERATO,
                      { prefix: _clickToCall.coperato.prefixes[prefix] },
                    )}
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
};

export default compose(
  React.memo,
  withNotifications,
)(Click2Call);
