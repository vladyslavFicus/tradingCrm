import { useCallback, useEffect, useState } from 'react';
import I18n from 'i18n-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormikValues } from 'formik';
import { Types, parseErrors, notify, useModal } from '@crm/common';
import { FilterSet__Types__Enum as FilterSetType, FilterSet__Option as FilterSet } from '__generated__/types';
import { FiltersFormValues as PaymentFilterSet } from 'components/PaymentsListFilters';
import { FormValues as ClientFilterSet } from 'routes/Clients/routes/ClientsList/types';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import ActionFilterModal, { ActionFilterModalProps } from 'modals/ActionFilterModal';
import { FilterSetsQueryVariables, useFilterSetsQuery } from '../graphql/__generated__/FilterSetsQuery';
import { useFilterSetByIdQueryLazyQuery } from '../graphql/__generated__/filterSetByIdQuery';
import { useUpdateFavouriteFilterSetMutation } from '../graphql/__generated__/UpdateFavouriteFilterSetMutation';
import { useDeleteFilterSetMutation } from '../graphql/__generated__/DeleteFilterSetMutation';

type Props = {
  filterSetType: FilterSetType,
  currentValues: FormikValues,
  disabled?: boolean,
  isOldClientsGridFilterPanel?: boolean,
  submitFilters: (filterSet: PaymentFilterSet | ClientFilterSet) => void,
};

type UseFilterSetsDecorator = {
  areButtonsVisible: boolean,
  selectedFilterSetUuid?: string,
  filterSetsListDisabled: boolean,
  filterSetsList: Array<FilterSet>,
  createFilterSet: () => void,
  updateFilterSet: () => void,
  deleteFilterSet: () => void,
  fetchFilterSetByUuid: (uuid: string) => void,
  updateFavouriteFilterSet: (uuid: string, newValue: boolean) => void,
};

const useFilterSetsDecorator = (props: Props): UseFilterSetsDecorator => {
  const {
    filterSetType,
    currentValues,
    disabled,
    isOldClientsGridFilterPanel,
    submitFilters,
  } = props;

  const state = useLocation().state as Types.State<FilterSetsQueryVariables>;
  const navigate = useNavigate();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const actionFilterModal = useModal<ActionFilterModalProps>(ActionFilterModal);

  const [selectedFilterSetUuid, setSelectedFilterSetUuid] = useState<string>();
  const [filterSetsLoading, setFilterSetsLoading] = useState(false);

  const [getFilterSetByIdQuery] = useFilterSetByIdQueryLazyQuery();
  const [updateFavouriteFilterSetMutation] = useUpdateFavouriteFilterSetMutation();
  const [deleteFilterSetMutation] = useDeleteFilterSetMutation();

  const { data, loading, error, refetch } = useFilterSetsQuery({
    variables: {
      type: filterSetType,
    },
    fetchPolicy: 'network-only',
  });
  const common = data?.filterSets?.common || [];
  const favourite = data?.filterSets?.favourite || [];

  const setActiveFilterSet = useCallback((uuid: string, filtersFields: Object) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        ...(!isOldClientsGridFilterPanel && filtersFields),
        selectedFilterSet: {
          uuid,
          fields: filtersFields,
        },
      },
    });
  }, [isOldClientsGridFilterPanel, navigate, state]);

  useEffect(() => {
    setSelectedFilterSetUuid(state?.selectedFilterSet?.uuid);
  }, [state?.selectedFilterSet?.uuid]);

  const removeActiveFilterSet = useCallback(() => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        selectedFilterSet: null,
      },
    });
  }, [state, navigate]);

  const createFilterSet = useCallback(() => {
    actionFilterModal.show({
      filterSetType,
      fields: currentValues,
      action: 'CREATE',
      onSuccess: async (_: any, { uuid = '' } : Types.SelectedFilterSet) => {
        await refetch({ type: filterSetType });

        setActiveFilterSet(uuid, Object.keys(currentValues));
        actionFilterModal.hide();
      },
    });
  }, [filterSetType, currentValues, actionFilterModal, refetch, setActiveFilterSet]);

  const updateFilterSet = useCallback(() => {
    const filterSet = [...favourite, ...common].find(
      ({ uuid }) => uuid === selectedFilterSetUuid,
    );

    actionFilterModal.show({
      filterSetType,
      fields: currentValues,
      action: 'UPDATE',
      filterId: selectedFilterSetUuid,
      name: filterSet?.name,
      onSuccess: async () => {
        await refetch({ type: filterSetType });

        actionFilterModal.hide();
      },
    });
  }, [favourite, common, filterSetType, currentValues, selectedFilterSetUuid, actionFilterModal, refetch]);

  const deleteFilterSet = useCallback(() => {
    const filterSet = [...favourite, ...common].find(
      ({ uuid }) => uuid === selectedFilterSetUuid,
    );

    confirmActionModal.show({
      uuid: selectedFilterSetUuid,
      onSubmit: async () => {
        try {
          await deleteFilterSetMutation({ variables: { uuid: selectedFilterSetUuid as string } });
          await refetch({ type: filterSetType });

          removeActiveFilterSet();

          notify({
            level: Types.LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('FILTER_SET.REMOVE_FILTER.SUCCESS'),
          });

          confirmActionModal.hide();
        } catch (e) {
          const err = parseErrors(e);

          notify({
            level: Types.LevelType.ERROR,
            title: I18n.t('FILTER_SET.REMOVE_FILTER.ERROR'),
            message:
              err.message || I18n.t('COMMON.SOMETHING_WRONG'),
          });
        }
      },
      modalTitle: I18n.t('FILTER_SET.REMOVE_MODAL.TITLE'),
      actionText: I18n.t('FILTER_SET.REMOVE_MODAL.TEXT'),
      fullName: filterSet?.name,
      submitButtonLabel: I18n.t('FILTER_SET.REMOVE_MODAL.BUTTON_ACTION'),
    });
  },
  [
    favourite, common, confirmActionModal,
    selectedFilterSetUuid, deleteFilterSetMutation,
    refetch, filterSetType, removeActiveFilterSet,
  ]);

  const fetchFilterSetByUuid = useCallback(async (uuid: string) => {
    setFilterSetsLoading(true);

    try {
      const filterSetByIdQuery = await getFilterSetByIdQuery({
        variables: {
          uuid,
        },
      });
      const { data: selectData } = filterSetByIdQuery;

      submitFilters(selectData?.filterSet);

      setActiveFilterSet(uuid, Object.keys(selectData?.filterSet));
    } catch {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILTER_SET.LOADING_FAILED'),
      });
    }

    setFilterSetsLoading(false);
  }, [getFilterSetByIdQuery, setActiveFilterSet, submitFilters]);

  const updateFavouriteFilterSet = useCallback(async (uuid: string, newValue: boolean) => {
    setFilterSetsLoading(true);

    try {
      await updateFavouriteFilterSetMutation({ variables: { uuid, favourite: newValue } });
      await refetch({ type: filterSetType });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('FILTER_SET.UPDATE_FAVOURITE.SUCCESS'),
      });
    } catch (e) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('FILTER_SET.UPDATE_FAVOURITE.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }

    setFilterSetsLoading(false);
  }, [filterSetType, refetch, updateFavouriteFilterSetMutation]);

  const filterSetsList = [...favourite, ...common];
  const filterSetsListDisabled = disabled || filterSetsLoading || loading || !!error;

  const areButtonsVisible = currentValues && Object.keys(currentValues).length > 0;

  return {
    areButtonsVisible,
    selectedFilterSetUuid,
    filterSetsListDisabled,
    filterSetsList,
    createFilterSet,
    updateFilterSet,
    deleteFilterSet,
    fetchFilterSetByUuid,
    updateFavouriteFilterSet,
  };
};

export default useFilterSetsDecorator;
