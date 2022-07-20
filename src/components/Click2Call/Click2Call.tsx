import React, { useMemo, useState } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { debounce } from 'lodash';
import ToolTip from 'react-portal-tooltip';
import jwtDecode from 'jwt-decode';
import classNames from 'classnames';
import { withNotifications } from 'hoc';
import { LevelType, Notify } from 'types';
import {
  ClickToCall__Phone__Type__Enum as PhoneType,
  ClickToCall__Customer__Type__Enum as CustomerType,
  ClickToCall__CallSystem__Enum as CallSystem,
} from '__generated__/types';
import { withStorage } from 'providers/StorageProvider';
import CircleLoader from 'components/CircleLoader';
import { useClickToCallConfigsQuery } from './graphql/__generated__/ClickToCallConfigsQuery';
import { useDidLogicCreateCallMutation } from './graphql/__generated__/DidlogicCreateCall';
import { useNewtelCreateCallMutation } from './graphql/__generated__/NewtelCreateCall';
import { useCommpeakCreateCallMutation } from './graphql/__generated__/CommpeakCreateCall';
import { useCoperatoCreateCallMutation } from './graphql/__generated__/CoperatoCreateCall';
import { ReactComponent as PhoneSVG } from './icons/phone.svg';
import didlogicIcon from './icons/didlogic.png';
import newtelIcon from './icons/newtel.png';
import commpeakIcon from './icons/commpeak.png';
import coperatoIcon from './icons/coperato.png';
import clearvoiceIcon from './icons/clearvoice.png';
import callstartedIcon from './icons/callstarted.png';
import './Click2Call.scss';

const ICONS: Record<CallSystem, string> = {
  [CallSystem.DIDLOGIC]: didlogicIcon,
  [CallSystem.NEWTEL]: newtelIcon,
  [CallSystem.COMMPEAK]: commpeakIcon,
  [CallSystem.COPERATO]: coperatoIcon,
  [CallSystem.CLEAR_VOICE]: clearvoiceIcon,
};

const TOOLTIP_STYLE = {
  arrowStyle: {
    color: '#fff',
    borderColor: 'none',
    marginTop: '-12px',
    left: '-12px',
  },
};

type ProviderOptionsType = {
  prefix?: string,
}

type Props = {
  customerType: CustomerType,
  notify: Notify,
  phoneType: PhoneType,
  uuid: string,
  token: string,
}

const Click2Call = (props: Props) => {
  const { uuid, customerType, phoneType, token, notify } = props;

  const configsQuery = useClickToCallConfigsQuery();

  const [didlogicCreateCall] = useDidLogicCreateCallMutation();
  const [newtelCreateCall] = useNewtelCreateCallMutation();
  const [commpeakCreateCall] = useCommpeakCreateCallMutation();
  const [coperatoCreateCall] = useCoperatoCreateCallMutation();

  const configs = configsQuery.data?.clickToCall.configs || [];

  // Get info from JWT token
  const { uuid: operatorUuid, brandId } = useMemo(() => jwtDecode<{ brandId: string, uuid: string }>(token), [token]);

  // ===== Getters ===== //
  const getClearVoiceUrl = (prefix: string) => {
    const url = `tel:${uuid}&${customerType}&${phoneType}&${operatorUuid}&${brandId}&${prefix}`;

    return url
      .replaceAll('-', '*')
      .replaceAll('_', '+'); // Replaces described in FS-5182 task
  };

  // ===== Handlers ===== //
  const [disabled, setDisabled] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const handleCreateCall = (callSystem: CallSystem, options?: ProviderOptionsType) => debounce(async () => {
    const { prefix = '' } = options || {};

    setDisabled(true);
    setTimeout(() => { setDisabled(false); }, 3000);

    try {
      switch (callSystem) {
        case CallSystem.DIDLOGIC:
          await didlogicCreateCall({ variables: { uuid, phoneType, customerType } });
          break;
        case CallSystem.NEWTEL:
          await newtelCreateCall({ variables: { uuid, phoneType, customerType, prefix } });
          break;
        case CallSystem.COMMPEAK:
          await commpeakCreateCall({ variables: { uuid, phoneType, customerType, prefix } });
          break;
        case CallSystem.COPERATO:
          await coperatoCreateCall({ variables: { uuid, phoneType, customerType, prefix } });
          break;
        default:
          break;
      }
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.CLICK_TO_CALL_FAILED'),
      });
      setDisabled(false);
    }
  }, 3000, { leading: true, trailing: false });

  return (
    <Choose>
      <When condition={configsQuery.loading}>
        <CircleLoader className="Click2Call__loader" size={18} />
      </When>
      <When condition={configs.length > 0}>
        <PhoneSVG
          id="PhoneSVG"
          className="Click2Call__icon"
          // Use this method because have trouble with ToolTip and we need here MouseEvent for re-render
          onMouseEnter={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
        />
        <ToolTip
          parent="#PhoneSVG"
          position="right"
          arrow="top"
          style={TOOLTIP_STYLE}
          active={isActive}
        >
          <div
            // Use this method because have trouble with ToolTip and we need here MouseEvent for re-render
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
            className={classNames('Click2Call__submenu', { 'Click2Call__submenu--disabled': disabled })}
          >
            <Choose>
              <When condition={!disabled}>
                {configs.map(({ callSystem, prefixes }) => (
                  <Choose>
                    {/* Show DIDLOGIC call system without prefixes */}
                    <When condition={callSystem === CallSystem.DIDLOGIC}>
                      <div
                        key={callSystem}
                        className="Click2Call__submenu-item"
                        onClick={handleCreateCall(callSystem)}
                      >
                        <img src={ICONS[callSystem]} alt="" />
                      </div>
                    </When>

                    {/* Show link to make a call in OS by tel protocol for CLEAR VOICE call system */}
                    <When condition={callSystem === CallSystem.CLEAR_VOICE}>
                      <div key={callSystem} className="Click2Call__submenu-item Click2Call__submenu-item--no-hover">
                        <img className="Click2Call__submenu-item-image" src={ICONS[callSystem]} alt={callSystem} />
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
                        <img className="Click2Call__submenu-item-image" src={ICONS[callSystem]} alt={callSystem} />
                        <div className="Click2Call__submenu-item-prefixes">
                          {prefixes.map(({ label, prefix }, index) => (
                            <span
                              key={`${prefix}-${index}`}
                              className="Click2Call__submenu-item-prefix"
                              onClick={handleCreateCall(callSystem, { prefix })}
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Otherwise>
                  </Choose>
                ))}
              </When>
              <When condition={disabled}>
                <img src={callstartedIcon} alt="Call Started" />
              </When>
            </Choose>
          </div>
        </ToolTip>
      </When>
    </Choose>
  );
};

export default compose(
  React.memo,
  withNotifications,
  withStorage(['token']),
)(Click2Call);
