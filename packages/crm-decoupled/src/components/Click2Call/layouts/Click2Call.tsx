import React from 'react';
import I18n from 'i18n-js';
import ToolTip from 'react-portal-tooltip';
import classNames from 'classnames';
import {
  ClickToCall__Phone__Type__Enum as PhoneType,
  ClickToCall__Customer__Type__Enum as CustomerType,
  ClickToCall__CallSystem__Enum as CallSystem,
} from '__generated__/types';
import CircleLoader from 'components/CircleLoader';
import { Button } from 'components/Buttons';
import { Arrow, Position } from 'components/Click2Call/types';
import useClick2Call from 'components/Click2Call/hooks/useClick2Call';
import { ICONS, TOOLTIP_STYLE } from './constants';
import { ReactComponent as PhoneSVG } from './icons/phone.svg';
import { ReactComponent as CallStartedIcon } from './icons/callstarted.svg';
import './Click2Call.scss';

type Props = {
  customerType: CustomerType,
  phoneType: PhoneType,
  uuid: string,
  position?: Position,
  arrow?: Arrow,
}

const Click2Call = (props: Props) => {
  const {
    uuid,
    customerType,
    phoneType,
    position = 'right',
    arrow = 'top',
  } = props;

  const {
    configs,
    id,
    isActive,
    loading,
    isCallStarted,
    setIsActive,
    getClearVoiceUrl,
    handleCreateCall,
  } = useClick2Call({ uuid, customerType, phoneType });

  return (
    <Choose>
      <When condition={loading}>
        <CircleLoader className="Click2Call__loader" size={18} />
      </When>

      <When condition={!!configs.length}>
        <PhoneSVG
          id={id}
          className="Click2Call__icon"
          // Use this method because have trouble with ToolTip and we need here MouseEvent for re-render
          onClick={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
        />

        <ToolTip
          parent={`#${id}`}
          position={position}
          arrow={arrow}
          style={TOOLTIP_STYLE}
          active={isActive}
        >
          <div
            // Use this method because have trouble with showing call inside ToolTip(without it can't see start calling)
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
            className="Click2Call__submenu"
          >
            <div className={classNames('Click2Call__providers', {
              'Click2Call__providers--call-started': isCallStarted,
            })}
            >
              {configs.map(({ callSystem, prefixes }) => {
                const ProviderIcon = ICONS[callSystem];

                return (
                  <Choose>
                    {/* Show call systems without prefixes */}
                    <When condition={[CallSystem.DIDLOGIC, CallSystem.SQUARETALK].includes(callSystem)}>
                      <div
                        key={callSystem}
                        className="Click2Call__submenu-item"
                        onClick={() => handleCreateCall(callSystem)}
                      >
                        <ProviderIcon className="Click2Call__submenu-item-image" />
                      </div>
                    </When>

                    {/* Show link to make a call in OS by tel protocol for CLEAR VOICE call system */}
                    <When condition={callSystem === CallSystem.CLEAR_VOICE}>
                      <div key={callSystem} className="Click2Call__submenu-item Click2Call__submenu-item--no-hover">
                        <ProviderIcon className="Click2Call__submenu-item-image" />

                        <div className="Click2Call__submenu-item-prefixes">
                          {prefixes.map(({ label, prefix }, index) => (
                            <a
                              key={`${prefix}-${index}`}
                              className="Click2Call__submenu-item-prefix"
                              href={getClearVoiceUrl(prefix)}
                            >
                              {label}
                            </a>
                          ))}
                        </div>
                      </div>
                    </When>

                    {/* Other call systems */}
                    <Otherwise>
                      <div key={callSystem} className="Click2Call__submenu-item Click2Call__submenu-item--no-hover">
                        <ProviderIcon className="Click2Call__submenu-item-image" />

                        <div className="Click2Call__submenu-item-prefixes">
                          {/* Only for NEWTEL need display "auto" button with prefix null */}
                          <If condition={callSystem === CallSystem.NEWTEL}>
                            <Button
                              primary
                              data-testid="Click2Call-autoButton"
                              onClick={() => handleCreateCall(callSystem, { prefix: null })}
                            >
                              {I18n.t('PLAYER_PROFILE.PROFILE.CLICK_TO_CALL_AUTO')}
                            </Button>
                          </If>

                          {prefixes.map(({ label, prefix }, index) => (
                            <span
                              key={`${prefix}-${index}`}
                              className="Click2Call__submenu-item-prefix"
                              onClick={() => handleCreateCall(callSystem, { prefix })}
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Otherwise>
                  </Choose>
                );
              })}
            </div>

            {/* Show call started icon instead of providers content on same width and height as were before */}
            <If condition={isCallStarted}>
              <CallStartedIcon className="Click2Call__call-started" />
            </If>
          </div>
        </ToolTip>
      </When>
    </Choose>
  );
};

export default React.memo(Click2Call);
