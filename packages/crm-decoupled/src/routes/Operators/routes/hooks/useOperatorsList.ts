import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { permissions } from 'config';
import { Sorts, State } from 'types';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import CreateOperatorModal, { CreateOperatorModalProps, ExistValues as FormValues } from 'modals/CreateOperatorModal';
import ExistingOperatorModal, { ExistingOperatorModalProps } from 'modals/ExistingOperatorModal';
import { OPERATORS_SORT } from '../../constants';
import { OperatorsQueryVariables, useOperatorsQuery } from '../graphql/__generated__/OperatorsQuery';

type UseOperatorsList = {
  allowCreateOperator: boolean,
  loading: boolean,
  content: any,
  last: boolean,
  totalElements: number,
  refetch: () => void,
  handleFetchMore: () => void,
  handleSort: (sorts: Sorts) => void,
  handleOpenCreateOperatorModal: () => void,
};

const useOperatorsList = (): UseOperatorsList => {
  const state = useLocation().state as State<OperatorsQueryVariables>;

  const navigate = useNavigate();

  const permission = usePermission();

  const allowCreateOperator = permission.allows(permissions.OPERATORS.CREATE);

  // ===== Modals ===== //
  const createOperatorModal = useModal<CreateOperatorModalProps>(CreateOperatorModal);
  const existingOperatorModal = useModal<ExistingOperatorModalProps>(ExistingOperatorModal);

  const { data, loading, variables = {}, refetch, fetchMore } = useOperatorsQuery({
    variables: {
      ...state?.filters as OperatorsQueryVariables,
      page: {
        from: 0,
        size: 20,
        sorts: state?.sorts?.length ? state.sorts : OPERATORS_SORT,
      },
    },
  });

  const { content = [], last = true, totalElements = 0, page = 0 } = data?.operators || {};

  // ===== Handlers ===== //
  const handleFetchMore = useCallback(() => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as OperatorsQueryVariables), 'page.from', page + 1),
      });
    }
  }, [page]);

  const handleSort = useCallback((sorts: Sorts) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  }, [state]);

  const handleOpenCreateOperatorModal = useCallback(() => {
    createOperatorModal.show({
      onExists: (values: FormValues) => existingOperatorModal.show(values),
    });
  }, [loading, page, variables]);

  return {
    allowCreateOperator,
    loading,
    content,
    last,
    totalElements,
    refetch,
    handleFetchMore,
    handleSort,
    handleOpenCreateOperatorModal,
  };
};

export default useOperatorsList;
