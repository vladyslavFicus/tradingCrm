import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { debounce } from 'lodash';
import { StatefulToolTip } from 'react-portal-tooltip';
import { withNotifications } from 'hoc';
import { LevelType, Notify } from 'types';
import {
  ClickToCall__Phone__Type__Enum as PhoneType,
  ClickToCall__Customer__Type__Enum as CustomerType,
  ClickToCall__CallSystem__Enum as CallSystem,
} from '__generated__/types';
import CircleLoader from 'components/CircleLoader';
import { useClickToCallConfigsQuery } from './graphql/__generated__/ClickToCallConfigsQuery';
import { useDidLogicCreateCallMutation } from './graphql/__generated__/DidlogicCreateCall';
import { useAsteriskCreateCallMutation } from './graphql/__generated__/AsteriskCreateCall';
import { useCommpeakCreateCallMutation } from './graphql/__generated__/CommpeakCreateCall';
import { useCoperatoCreateCallMutation } from './graphql/__generated__/CoperatoCreateCall';
import { useClearVoiceCreateCallMutation } from './graphql/__generated__/ClearVoiceCreateCall';
import { ReactComponent as PhoneSVG } from './icons/phone.svg';
import didlogicIcon from './icons/didlogic.png';
import asteriskIcon from './icons/asterisk.png';
import commpeakIcon from './icons/commpeak.png';
import coperatoIcon from './icons/coperato.png';
import clearvoiceIcon from './icons/clearvoice.png';
import './Click2Call.scss';

const ICONS: Record<CallSystem, string> = {
  [CallSystem.DIDLOGIC]: didlogicIcon,
  [CallSystem.ASTERISK]: asteriskIcon,
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
}

const Click2Call = (props: Props) => {
  const { uuid, customerType, phoneType, notify } = props;

  const configsQuery = useClickToCallConfigsQuery({
    variables: {
      uuid,
      customerType,
      phoneType,
    },
  });

  const [didlogicCreateCall] = useDidLogicCreateCallMutation();
  const [asteriskCreateCall] = useAsteriskCreateCallMutation();
  const [commpeakCreateCall] = useCommpeakCreateCallMutation();
  const [coperatoCreateCall] = useCoperatoCreateCallMutation();
  const [clearVoiceCreateCall] = useClearVoiceCreateCallMutation();

  const configs = configsQuery.data?.clickToCall.configs || [];

  // ===== Handlers ===== //
  const handleCreateCall = (callSystem: CallSystem, options?: ProviderOptionsType) => debounce(async () => {
    const { prefix = '' } = options || {};

    try {
      switch (callSystem) {
        case CallSystem.DIDLOGIC:
          await didlogicCreateCall({ variables: { uuid, phoneType, customerType } });
          break;
        case CallSystem.ASTERISK:
          await asteriskCreateCall({ variables: { uuid, phoneType, customerType, prefix } });
          break;
        case CallSystem.COMMPEAK:
          await commpeakCreateCall({ variables: { uuid, phoneType, customerType, prefix } });
          break;
        case CallSystem.COPERATO:
          await coperatoCreateCall({ variables: { uuid, phoneType, customerType, prefix } });
          break;
        case CallSystem.CLEAR_VOICE:
          await clearVoiceCreateCall({ variables: { uuid, phoneType, customerType, prefix } });
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

  return (
    <Choose>
      <When condition={configsQuery.loading}>
        <CircleLoader className="Click2Call__loader" size={18} />
      </When>
      <When condition={configs.length > 0}>
        <StatefulToolTip
          parent={<PhoneSVG className="Click2Call__icon" />}
          position="right"
          arrow="top"
          style={TOOLTIP_STYLE}
        >
          <div className="Click2Call__submenu">
            {configs.map(({ callSystem, prefixes, additionalFields }) => (
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
                          href={`tel:${prefix}${additionalFields?.phone}`}
                          onClick={handleCreateCall(callSystem, { prefix })}
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
          </div>
        </StatefulToolTip>
      </When>
    </Choose>
  );
};

export default compose(
  React.memo,
  withNotifications,
)(Click2Call);
