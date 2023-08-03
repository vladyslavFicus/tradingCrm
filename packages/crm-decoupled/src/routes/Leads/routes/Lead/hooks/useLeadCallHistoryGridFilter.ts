import { ClickToCall__CallSystem__Enum as ClickToCallCallSystemEnum } from '__generated__/types';
import { useClickToCallConfigQuery } from '../graphql/__generated__/ClickToCallConfigQuery';

type UseLeadCallHistoryGridFilter = {
  loading: boolean,
  callSystems: Array<ClickToCallCallSystemEnum>,
};

const useLeadCallHistoryGridFilter = (): UseLeadCallHistoryGridFilter => {
  // ===== Requests ===== //
  const { data, loading } = useClickToCallConfigQuery();

  const callSystems = (data?.clickToCall.configs || []).map(config => config.callSystem);

  return {
    loading,
    callSystems,
  };
};

export default useLeadCallHistoryGridFilter;
