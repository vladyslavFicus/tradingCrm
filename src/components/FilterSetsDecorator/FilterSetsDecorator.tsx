import React, { useEffect, useState } from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import compose from 'compose-function';
import { FieldProps } from 'formik';
import { withModals } from 'hoc';
import { Modal, State } from 'types';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import ActionFilterModal from 'modals/ActionFilterModal';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { FilterSet__Types__Enum as FilterSetType } from '__generated__/types';
import { FilterSetContext } from 'types/filterSet';
import { SelectedFilterSet } from 'types/selectedFilterSet';
import FilterSets from './components/FilterSets';
import { FilterSetsQueryVariables, useFilterSetsQuery } from './graphql/__generated__/FilterSetsQuery';
import { useFilterSetByIdQueryLazyQuery } from './graphql/__generated__/filterSetByIdQuery';
import { useUpdateFavouriteFilterSetMutation } from './graphql/__generated__/UpdateFavouriteFilterSetMutation';
import { useDeleteFilterSetMutation } from './graphql/__generated__/DeleteFilterSetMutation';
import './FilterSetsDecorator.scss';

type Modals = {
  actionFilterModal: Modal,
};

type Props = {
  modals: Modals,
  children: React.ReactNode,
  filterSetType: FilterSetType,
  currentValues: FieldProps,
  disabled?: boolean,
  renderBefore?: React.ReactNode,
  isOldClientsGridFilterPanel?: boolean,
  submitFilters: (filterSet: string) => void,
};

export const FilterSetsContext = React.createContext({} as FilterSetContext);

const FilterSetsDecorator = (props: Props) => {
  const {
    modals: {
      actionFilterModal,
    },
    children,
    filterSetType,
    currentValues,
    disabled,
    isOldClientsGridFilterPanel,
    renderBefore,
    submitFilters,
  } = props;

  const { state } = useLocation<State<FilterSetsQueryVariables>>();
  const history = useHistory();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

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

  const setActiveFilterSet = (uuid: string, filtersFields: Object) => {
    history.replace({
      state: {
        ...state,
        ...(!isOldClientsGridFilterPanel && filtersFields),
        selectedFilterSet: {
          uuid,
          fields: filtersFields,
        },
      },
    });
  };

  useEffect(() => {
    setSelectedFilterSetUuid(state?.selectedFilterSet?.uuid);
  }, [state?.selectedFilterSet?.uuid]);

  const removeActiveFilterSet = () => {
    history.replace({
      state: {
        ...state,
        selectedFilterSet: null,
      },
    });
  };

  const createFilterSet = () => {
    actionFilterModal.show({
      filterSetType,
      fields: currentValues,
      action: 'CREATE',
      onSuccess: async (_: any, { uuid } : SelectedFilterSet) => {
        await refetch({ type: filterSetType });

        setActiveFilterSet(uuid, Object.keys(currentValues));
        actionFilterModal.hide();
      },
    });
  };

  const updateFilterSet = () => {
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
  };

  const deleteFilterSet = () => {
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
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('FILTER_SET.REMOVE_FILTER.SUCCESS'),
          });

          confirmActionModal.hide();
        } catch (e) {
          const err = parseErrors(e);

          notify({
            level: LevelType.ERROR,
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
  };

  const fetchFilterSetByUuid = async (uuid: string) => {
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
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILTER_SET.LOADING_FAILED'),
      });
    }

    setFilterSetsLoading(false);
  };

  const updateFavouriteFilterSet = async (uuid: string, newValue: boolean) => {
    setFilterSetsLoading(true);

    try {
      await updateFavouriteFilterSetMutation({ variables: { uuid, favourite: newValue } });
      await refetch({ type: filterSetType });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('FILTER_SET.UPDATE_FAVOURITE.SUCCESS'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('FILTER_SET.UPDATE_FAVOURITE.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }

    setFilterSetsLoading(false);
  };

  const filterSetsList = [...favourite, ...common];
  const filterSetsListDisabled = disabled || filterSetsLoading || loading || !!error;

  const areButtonsVisible = currentValues && Object.keys(currentValues).length > 0;

  return (
    <FilterSetsContext.Provider
      value={{
        visible: areButtonsVisible,
        hasSelectedFilterSet: !!selectedFilterSetUuid,
        disabled: filterSetsListDisabled,
        createFilterSet,
        updateFilterSet,
        deleteFilterSet,
      }}
    >
      <div className="FilterSetsDecorator__control">
        {renderBefore}

        <FilterSets
          filterSetsList={filterSetsList}
          selectedFilterSetUuid={selectedFilterSetUuid}
          disabled={filterSetsListDisabled}
          selectFilterSet={fetchFilterSetByUuid}
          updateFavouriteFilterSet={updateFavouriteFilterSet}
        />
      </div>

      {children}
    </FilterSetsContext.Provider>
  );
};

export default compose(
  React.memo,
  withModals({
    actionFilterModal: ActionFilterModal,
  }),
)(FilterSetsDecorator);
