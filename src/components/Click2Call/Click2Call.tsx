import React, { SVGProps, useMemo, useRef, useState } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { debounce } from 'lodash';
import ToolTip from 'react-portal-tooltip';
import jwtDecode from 'jwt-decode';
import classNames from 'classnames';
import { v4 } from 'uuid';
import {
  ClickToCall__Phone__Type__Enum as PhoneType,
  ClickToCall__Customer__Type__Enum as CustomerType,
  ClickToCall__CallSystem__Enum as CallSystem,
} from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { withStorage } from 'providers/StorageProvider';
import CircleLoader from 'components/CircleLoader';
import { Button } from 'components/Buttons';
import { useClickToCallConfigsQuery } from './graphql/__generated__/ClickToCallConfigsQuery';
import { useDidLogicCreateCallMutation } from './graphql/__generated__/DidlogicCreateCall';
import { useNewtelCreateCallMutation } from './graphql/__generated__/NewtelCreateCall';
import { useCommpeakCreateCallMutation } from './graphql/__generated__/CommpeakCreateCall';
import { useCoperatoCreateCallMutation } from './graphql/__generated__/CoperatoCreateCall';
import { useSquaretalkCreateCallMutation } from './graphql/__generated__/SquaretalkCreateCall';
import { useGlobalcallCreateCallMutation } from './graphql/__generated__/GlobalcallCreateCall';
import { ReactComponent as PhoneSVG } from './icons/phone.svg';
import { ReactComponent as DidlogicIcon } from './icons/didlogic.svg';
import { ReactComponent as NewtelIcon } from './icons/newtel.svg';
import { ReactComponent as CommpeakIcon } from './icons/commpeak.svg';
import { ReactComponent as CoperatoIcon } from './icons/coperato.svg';
import { ReactComponent as ClearvoiceIcon } from './icons/clearvoice.svg';
import { ReactComponent as SquaretalkIcon } from './icons/squaretalk.svg';
import { ReactComponent as GlobalcallIcon } from './icons/globalcall.svg';
import { ReactComponent as CallStartedIcon } from './icons/callstarted.svg';
import './Click2Call.scss';

const ICONS: Record<CallSystem, React.ElementType<SVGProps<SVGSVGElement>>> = {
  [CallSystem.DIDLOGIC]: DidlogicIcon,
  [CallSystem.NEWTEL]: NewtelIcon,
  [CallSystem.COMMPEAK]: CommpeakIcon,
  [CallSystem.COPERATO]: CoperatoIcon,
  [CallSystem.CLEAR_VOICE]: ClearvoiceIcon,
  [CallSystem.SQUARETALK]: SquaretalkIcon,
  [CallSystem.GLOBAL_CALL]: GlobalcallIcon,
};

const TOOLTIP_STYLE = {
  style: {
    background: 'var(--dropdown-surface-background)',
    borderRadius: '5px',
    'z-index': 'var(--z-index-popover)',
  },
  arrowStyle: {
    color: 'var(--dropdown-surface-background)',
    borderColor: 'none',
    marginTop: '-12px',
    left: '-12px',
  },
};

type Position = 'top' | 'right' | 'bottom' | 'left';

type Arrow = null | 'center' | 'top' | 'right' | 'bottom' | 'left';

type ProviderOptionsType = {
  prefix?: string | null,
}

type Props = {
  customerType: CustomerType,
  phoneType: PhoneType,
  uuid: string,
  token: string,
  position?: Position,
  arrow?: Arrow,
}

const Click2Call = (props: Props) => {
  const idRef = useRef(`click2call-${v4()}`);
  const {
    uuid,
    customerType,
    phoneType,
    token,
    position = 'right',
    arrow = 'top',
  } = props;

  const configsQuery = useClickToCallConfigsQuery({ context: { batch: false } });

  const [didlogicCreateCall] = useDidLogicCreateCallMutation();
  const [newtelCreateCall] = useNewtelCreateCallMutation();
  const [commpeakCreateCall] = useCommpeakCreateCallMutation();
  const [coperatoCreateCall] = useCoperatoCreateCallMutation();
  const [squaretalkCreateCall] = useSquaretalkCreateCallMutation();
  const [globalcallCreateCall] = useGlobalcallCreateCallMutation();

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
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const handleCreateCall = (callSystem: CallSystem, options?: ProviderOptionsType) => debounce(async () => {
    const { prefix = '' } = options || {};

    setIsCallStarted(true);
    setTimeout(() => { setIsCallStarted(false); }, 3000);

    try {
      switch (callSystem) {
        case CallSystem.DIDLOGIC:
          await didlogicCreateCall({ variables: { uuid, phoneType, customerType } });
          break;
        case CallSystem.NEWTEL:
          await newtelCreateCall({ variables: { uuid, phoneType, customerType, prefix } });
          break;
        case CallSystem.COMMPEAK:
          await commpeakCreateCall({ variables: { uuid, phoneType, customerType, prefix: prefix as string } });
          break;
        case CallSystem.COPERATO:
          await coperatoCreateCall({ variables: { uuid, phoneType, customerType, prefix: prefix as string } });
          break;
        case CallSystem.SQUARETALK:
          await squaretalkCreateCall({ variables: { uuid, phoneType, customerType } });
          break;
        case CallSystem.GLOBAL_CALL:
          await globalcallCreateCall({ variables: { uuid, phoneType, customerType, prefix: prefix as string } });
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

      setIsCallStarted(false);
    }
  }, 3000, { leading: true, trailing: false });

  return (
    <Choose>
      <When condition={configsQuery.loading}>
        <CircleLoader className="Click2Call__loader" size={18} />
      </When>
      <When condition={configs.length > 0}>
        <PhoneSVG
          id={idRef.current}
          className="Click2Call__icon"
          // Use this method because have trouble with ToolTip and we need here MouseEvent for re-render
          onClick={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
        />
        <ToolTip
          parent={`#${idRef.current}`}
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
                        onClick={handleCreateCall(callSystem)}
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
                              onClick={handleCreateCall(callSystem, { prefix: null })}
                            >
                              {I18n.t('PLAYER_PROFILE.PROFILE.CLICK_TO_CALL_AUTO')}
                            </Button>
                          </If>

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

export default compose(
  React.memo,
  withStorage(['token']),
)(Click2Call);
