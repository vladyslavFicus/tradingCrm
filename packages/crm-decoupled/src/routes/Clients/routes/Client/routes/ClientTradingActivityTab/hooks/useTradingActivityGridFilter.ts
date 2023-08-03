import { useLocation } from 'react-router-dom';
import { LabelValue, State } from 'types';
import { getAvailablePlatformTypes } from 'utils/tradingAccount';
import { TradingActivityQueryVariables } from '../graphql/__generated__/TradingActivityQuery';
import { useOperatorsQuery } from '../graphql/__generated__/OperatorsQuery';
import { useTradingAccountsQuery } from '../graphql/__generated__/TradingAccountsQuery';
import { OPERATORS_SORT } from '../constants';
import { Accounts, OriginalAgent } from '../types/tradingActivityGridFilter';

type Props = {
  profileUUID: string,
};

type UseTradingActivityGridFilter = {
  tradeType: string | null,
  accounts: Array<Accounts>,
  disabledOriginalAgentField: boolean,
  originalAgents: Array<OriginalAgent>,
  platformTypes: Array<LabelValue>,
  tradingAccountsLoading: boolean,
};

const useTradingActivityGridFilter = (props: Props): UseTradingActivityGridFilter => {
  const { profileUUID } = props;

  const state = useLocation().state as State<TradingActivityQueryVariables>;

  // ===== Requests ===== //
  const { data: operatorsData, loading: operatorsLoading } = useOperatorsQuery({
    variables: { page: { sorts: OPERATORS_SORT } },
  });

  const { data: tradingAccountsData, loading: tradingAccountsLoading } = useTradingAccountsQuery({
    variables: { profileUUID },
  });

  const accounts = tradingAccountsData?.clientTradingAccounts || [];
  const originalAgents = operatorsData?.operators?.content || [];
  const disabledOriginalAgentField = operatorsLoading;

  const platformTypes = getAvailablePlatformTypes();

  // ===== Handlers ===== //
  const tradeType = state?.filters && ('tradeType' in state.filters) ? state.filters.tradeType : 'LIVE';

  return {
    tradeType,
    accounts,
    disabledOriginalAgentField,
    originalAgents,
    platformTypes,
    tradingAccountsLoading,
  };
};

export default useTradingActivityGridFilter;
