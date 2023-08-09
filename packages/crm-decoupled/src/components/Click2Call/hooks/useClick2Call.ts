import { useCallback, useMemo, useRef, useState } from 'react';
import { v4 } from 'uuid';
import I18n from 'i18n-js';
import jwtDecode from 'jwt-decode';
import { debounce } from 'lodash';
import {
  ClickToCall__Phone__Type__Enum as PhoneType,
  ClickToCall__Customer__Type__Enum as CustomerType,
  ClickToCall__CallSystem__Enum as CallSystem,
} from '__generated__/types';
import { useStorageState } from 'providers/StorageProvider';
import { LevelType, notify } from 'providers/NotificationProvider';
import { useClickToCallConfigsQuery } from '../graphql/__generated__/ClickToCallConfigsQuery';
import { useDidLogicCreateCallMutation } from '../graphql/__generated__/DidlogicCreateCall';
import { useNewtelCreateCallMutation } from '../graphql/__generated__/NewtelCreateCall';
import { useCommpeakCreateCallMutation } from '../graphql/__generated__/CommpeakCreateCall';
import { useCoperatoCreateCallMutation } from '../graphql/__generated__/CoperatoCreateCall';
import { useSquaretalkCreateCallMutation } from '../graphql/__generated__/SquaretalkCreateCall';
import { useGlobalcallCreateCallMutation } from '../graphql/__generated__/GlobalcallCreateCall';
import { Config, ProviderOptionsType } from '../types';

type Props = {
  customerType: CustomerType,
  phoneType: PhoneType,
  uuid: string,
};

type UseClick2Call = {
  configs: Array<Config>,
  id: string,
  loading: boolean,
  isCallStarted: boolean,
  isActive: boolean,
  setIsActive: (value: boolean) => void,
  getClearVoiceUrl: (prefix: string) => string,
  handleCreateCall: (callSystem: CallSystem, options?: ProviderOptionsType) => void,
};

const useClick2Call = (props: Props): UseClick2Call => {
  const { customerType, phoneType, uuid } = props;

  const [isActive, setIsActive] = useState(false);
  const [isCallStarted, setIsCallStarted] = useState(false);

  const idRef = useRef(`click2call-${v4()}`);
  const id = idRef.current;

  // ===== Storage ===== //
  const [token] = useStorageState<string>('token');

  const { data, loading } = useClickToCallConfigsQuery({ context: { batch: false } });

  const [didlogicCreateCall] = useDidLogicCreateCallMutation();
  const [newtelCreateCall] = useNewtelCreateCallMutation();
  const [commpeakCreateCall] = useCommpeakCreateCallMutation();
  const [coperatoCreateCall] = useCoperatoCreateCallMutation();
  const [squaretalkCreateCall] = useSquaretalkCreateCallMutation();
  const [globalcallCreateCall] = useGlobalcallCreateCallMutation();

  const configs = data?.clickToCall.configs || [];

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
  const handleCreateCall = useCallback(debounce(async (callSystem: CallSystem, options?: ProviderOptionsType) => {
    const { prefix = '' } = options || {};

    setIsCallStarted(true);
    setTimeout(() => setIsCallStarted(false), 3000);

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
  }, 3000, { leading: true, trailing: false }), [isCallStarted]);

  return {
    configs,
    id,
    isActive,
    setIsActive,
    getClearVoiceUrl,
    isCallStarted,
    handleCreateCall,
    loading,
  };
};

export default useClick2Call;
