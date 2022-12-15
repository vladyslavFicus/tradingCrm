import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import { withApollo } from '@apollo/client/react/hoc';
import { withModals } from 'hoc';
import { withRequests, parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import PropTypes from 'constants/propTypes';
import ActionFilterModal from 'modals/ActionFilterModal';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import FilterSets from './components/FilterSets';
import {
  FilterSetsQuery,
  filterSetByIdQuery,
  DeleteFilterSetMutation,
  UpdateFavouriteFilterSetMutation,
} from './graphql';
import './FilterSetsDecorator.scss';

export const FilterSetsContext = React.createContext();

class FilterSetsDecorator extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    client: PropTypes.object.isRequired,
    modals: PropTypes.shape({
      actionFilterModal: PropTypes.modalType,
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
    filterSetsQuery: PropTypes.query({
      filterSets: PropTypes.shape({
        favourite: PropTypes.arrayOf(PropTypes.object),
        common: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    deleteFilterSetMutation: PropTypes.func.isRequired,
    updateFavouriteFilterSetMutation: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    filterSetType: PropTypes.string.isRequired,
    currentValues: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    submitFilters: PropTypes.func.isRequired,
    renderBefore: PropTypes.element,
  };

  static defaultProps = {
    disabled: false,
    renderBefore: null,
  };

  static getDerivedStateFromProps({ location }) {
    return {
      selectedFilterSet: location?.state?.selectedFilterSet || '',
    };
  }

  state = {
    selectedFilterSet: '',
    filterSetsLoading: false,
  };

  setActiveFilterSet = (uuid, filtersFields) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filtersFields,
        selectedFilterSet: uuid,
      },
    });
  };

  removeActiveFilterSet = () => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        selectedFilterSet: null,
      },
    });
  };

  refetchFilterSets = () => {
    const {
      filterSetType,
      filterSetsQuery: {
        refetch,
      },
    } = this.props;

    return refetch({ type: filterSetType });
  };

  createFilterSet = () => {
    const {
      modals: {
        actionFilterModal,
      },
      filterSetType,
      currentValues,
    } = this.props;

    actionFilterModal.show({
      filterSetType,
      fields: currentValues,
      action: 'CREATE',
      onSuccess: async (_, { uuid }) => {
        await this.refetchFilterSets();

        this.setActiveFilterSet(uuid, Object.keys(currentValues));
        actionFilterModal.hide();
      },
    });
  }

  updateFilterSet = () => {
    const {
      modals: {
        actionFilterModal,
      },
      filterSetType,
      currentValues,
      filterSetsQuery,
    } = this.props;

    const { selectedFilterSet } = this.state;

    const {
      common,
      favourite,
    } = filterSetsQuery.data?.filterSets || {};

    actionFilterModal.show({
      filterSetType,
      fields: currentValues,
      action: 'UPDATE',
      filterId: selectedFilterSet,
      name: [...favourite, ...common].find(
        ({ uuid }) => uuid === selectedFilterSet,
      ).name,
      onSuccess: async () => {
        await this.refetchFilterSets();

        actionFilterModal.hide();
      },
    });
  };

  fetchFilterSetByUuid = async (uuid) => {
    const {
      client,
      submitFilters,
    } = this.props;

    this.setState({ filterSetsLoading: true });

    try {
      const { data: { filterSet } } = await client.query({
        query: filterSetByIdQuery,
        variables: { uuid },
      });

      submitFilters(filterSet);

      this.setActiveFilterSet(uuid, Object.keys(filterSet));
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILTER_SET.LOADING_FAILED'),
      });
    }

    this.setState({ filterSetsLoading: false });
  };

  updateFavouriteFilterSet = async (uuid, newValue) => {
    const {
      updateFavouriteFilterSetMutation,
    } = this.props;

    this.setState({ filterSetsLoading: true });

    try {
      await updateFavouriteFilterSetMutation({ variables: { uuid, favourite: newValue } });
      await this.refetchFilterSets();

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

    this.setState({ filterSetsLoading: false });
  };

  deleteFilterSet = () => {
    const {
      modals: {
        confirmActionModal,
      },
      filterSetsQuery,
      deleteFilterSetMutation,
    } = this.props;

    const { selectedFilterSet } = this.state;

    const {
      common,
      favourite,
    } = filterSetsQuery.data?.filterSets || {};

    confirmActionModal.show({
      uuid: selectedFilterSet,
      onSubmit: async () => {
        try {
          await deleteFilterSetMutation({ variables: { uuid: selectedFilterSet } });
          await this.refetchFilterSets();

          this.removeActiveFilterSet();

          notify({
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('FILTER_SET.REMOVE_FILTER.SUCCESS'),
          });

          confirmActionModal.hide();
        } catch (e) {
          const error = parseErrors(e);

          notify({
            level: LevelType.ERROR,
            title: I18n.t('FILTER_SET.REMOVE_FILTER.ERROR'),
            message:
              error.message || I18n.t('COMMON.SOMETHING_WRONG'),
          });
        }
      },
      modalTitle: I18n.t('FILTER_SET.REMOVE_MODAL.TITLE'),
      actionText: I18n.t('FILTER_SET.REMOVE_MODAL.TEXT'),
      fullName: [...favourite, ...common].find(
        ({ uuid }) => uuid === selectedFilterSet,
      ).name,
      submitButtonLabel: I18n.t('FILTER_SET.REMOVE_MODAL.BUTTON_ACTION'),
    });
  };

  render() {
    const {
      children,
      disabled,
      currentValues,
      filterSetsQuery,
      renderBefore,
    } = this.props;

    const {
      selectedFilterSet,
      filterSetsLoading,
    } = this.state;

    const {
      common,
      favourite,
    } = filterSetsQuery.data?.filterSets || {};

    const filterSetsList = [...(favourite || []), ...(common || [])];
    const filterSetsListDisabled = disabled || filterSetsLoading || filterSetsQuery.loading || filterSetsQuery.error;

    const areButtonsVisible = currentValues && Object.keys(currentValues).length > 0;

    return (
      <FilterSetsContext.Provider
        value={{
          visible: areButtonsVisible,
          hasSelectedFilterSet: !!selectedFilterSet,
          disabled: filterSetsListDisabled,
          createFilterSet: this.createFilterSet,
          updateFilterSet: this.updateFilterSet,
          deleteFilterSet: this.deleteFilterSet,
        }}
      >
        <div className="FilterSetsDecorator__control">
          {renderBefore}
          <FilterSets
            filterSetsList={filterSetsList}
            selectedFilterSet={selectedFilterSet}
            disabled={filterSetsListDisabled}
            selectFilterSet={this.fetchFilterSetByUuid}
            updateFavouriteFilterSet={this.updateFavouriteFilterSet}
          />
        </div>
        {children}
      </FilterSetsContext.Provider>
    );
  }
}

export default compose(
  withApollo,
  withRouter,
  withModals({
    actionFilterModal: ActionFilterModal,
    confirmActionModal: ConfirmActionModal,
  }),
  withRequests({
    filterSetsQuery: FilterSetsQuery,
    deleteFilterSetMutation: DeleteFilterSetMutation,
    updateFavouriteFilterSetMutation: UpdateFavouriteFilterSetMutation,
  }),
)(FilterSetsDecorator);
