import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaymentSystemProvider } from '__generated__/types';
import { Sort, State } from 'types';
import permissions from 'config/permissions';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import { usePermission } from 'providers/PermissionsProvider';
import {
  PaymentSystemsProviderQueryVariables,
  usePaymentSystemsProviderQuery,
} from '../graphql/__generated__/PaymentSystemsProviderQuery';
import { useDeletePaymentSystemsProviderMutation } from '../graphql/__generated__/DeletePaymentSystemsProviderMutation';
import { useCreatePaymentSystemsProviderMutation } from '../graphql/__generated__/CreatePaymentSystemsProviderMutation';

type PaymentSystemsProviderVariables = PaymentSystemsProviderQueryVariables['args'];

type UsePSPList = {
  content: Array<PaymentSystemProvider>,
  loading: boolean,
  last: boolean,
  totalElements: number,
  updateFavorites: boolean,
  refetch: () => void,
  handleFavorite: (paymentSystem: string, isFavourite?: boolean | null) => void,
  handlePageChanged: () => void,
  handleSort: (sorts: Sort[]) => void,
}

const usePSPList = (): UsePSPList => {
  const state = useLocation().state as State<PaymentSystemsProviderVariables>;

  const navigate = useNavigate();

  const permission = usePermission();

  const updateFavorites = permission.allows(permissions.PAYMENT.UPDATE_PSP);

  // ===== Requests ===== //
  const [deletePaymentSystemsProvider] = useDeletePaymentSystemsProviderMutation();
  const [createPaymentSystemsProvider] = useCreatePaymentSystemsProviderMutation();

  const paymentSystemsProviderQuery = usePaymentSystemsProviderQuery({
    variables: {
      args: {
        ...state?.filters as PaymentSystemsProviderVariables,
        withFavouriteStatus: true,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
  });

  const { data, loading, refetch } = paymentSystemsProviderQuery;

  const { content = [], number = 0, last = false, totalElements = 0 } = data?.settings?.paymentSystemsProvider || {};

  // ===== Handlers ===== //
  const handleFavorite = useCallback(async (paymentSystem: string, isFavourite?: boolean | null) => {
    try {
      const variables = { paymentSystem };

      if (isFavourite) {
        await deletePaymentSystemsProvider({ variables });
      } else {
        await createPaymentSystemsProvider({ variables });
      }
      await refetch();
    } catch (e) {
      // do nothing
    }
  }, [createPaymentSystemsProvider, deletePaymentSystemsProvider, refetch]);

  const handlePageChanged = useHandlePageChanged({ query: paymentSystemsProviderQuery, page: number });

  const handleSort = useCallback((sorts: Sort[]) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  }, [state, navigate]);

  return {
    content,
    loading,
    last,
    totalElements,
    updateFavorites,
    refetch,
    handleFavorite,
    handlePageChanged,
    handleSort,
  };
};

export default usePSPList;
