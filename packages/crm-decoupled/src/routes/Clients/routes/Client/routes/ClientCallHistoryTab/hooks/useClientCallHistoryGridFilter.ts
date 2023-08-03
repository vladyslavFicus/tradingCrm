import { useMemo } from 'react';
import { useClickToCallConfigQuery } from '../graphql/__generated__/ClickToCallConfigQuery';

const useClientCallHistoryGridFilter = () => {
  // ===== Requests ===== //
  const clickToCallConfigQuery = useClickToCallConfigQuery();

  const CallSystems = useMemo(() => (
    clickToCallConfigQuery?.data?.clickToCall.configs || []).map((config: { callSystem: string }) => config.callSystem),
  [clickToCallConfigQuery?.data?.clickToCall.configs]);

  return {
    clickToCallConfigQuery,
    CallSystems,
  };
};

export default useClientCallHistoryGridFilter;
