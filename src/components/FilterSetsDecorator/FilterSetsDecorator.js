import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { compose, withApollo } from 'react-apollo';
import { withModals, withNotifications } from 'hoc';
import { withRequests, parseErrors } from 'apollo';
import PropTypes from 'constants/propTypes';
import ActionFilterModal from 'modals/ActionFilterModal';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import FilterSetsToggler from './components/FilterSetsToggler';
import FilterSetsButtons from './components/FilterSetsButtons';
import FilterSets from './components/FilterSets';
import {
  FilterSetsQuery,
  filterSetByIdQuery,
  DeleteFilterSetMutation,
  UpdateFavouriteFilterSetMutation,
} from './graphql';

class FilterSetsDecorator extends PureComponent {
  static propTypes = {
    notify: PropTypes.func.isRequired,
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
    children: PropTypes.func.isRequired,
    filterSetType: PropTypes.string.isRequired,
    currentValues: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    submitFilters: PropTypes.func.isRequired,
    resetFilters: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  state = {
    selectedFilter: '',
    filterSetsLoading: false,
  };

  selectFilter = uuid => this.setState({ selectedFilter: uuid });

  createFilter = () => {
    const {
      filterSetType,
      currentValues,
      modals: {
        actionFilterModal,
      },
      filterSetsQuery: {
        refetch,
      },
    } = this.props;

    actionFilterModal.show({
      filterSetType,
      fields: currentValues,
      action: 'CREATE',
      onSuccess: async (_, { uuid }) => {
        await refetch({ type: filterSetType });

        this.selectFilter(uuid);
        actionFilterModal.hide();
      },
    });
  }

  updateFilter = () => {
    const {
      modals: {
        actionFilterModal,
      },
      currentValues,
      filterSetType,
      filterSetsQuery: {
        refetch,
        data,
      },
    } = this.props;

    const { selectedFilter } = this.state;

    const {
      common,
      favourite,
    } = data?.filterSets || {};

    actionFilterModal.show({
      onSuccess: async () => {
        await refetch({ type: filterSetType });
        actionFilterModal.hide();
      },
      action: 'UPDATE',
      fields: currentValues,
      filterId: selectedFilter,
      name: [...favourite, ...common].find(
        ({ uuid }) => uuid === selectedFilter,
      ).name,
    });
  };

  fetchFilterByUuid = async (uuid) => {
    const {
      notify,
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

      this.selectFilter(uuid);
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILTER_SET.LOADING_FAILED'),
      });
    }

    this.setState({ filterSetsLoading: false });
  };

  updateFavouriteFilter = async (uuid, newValue) => {
    const {
      notify,
      updateFavouriteFilterSetMutation,
      filterSetType,
      filterSetsQuery: {
        refetch,
      },
    } = this.props;

    this.setState({ filterSetsLoading: true });

    try {
      await updateFavouriteFilterSetMutation({ variables: { uuid, favourite: newValue } });

      refetch({ type: filterSetType });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('FILTER_SET.UPDATE_FAVOURITE.SUCCESS'),
      });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('FILTER_SET.UPDATE_FAVOURITE.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }

    this.setState({ filterSetsLoading: false });
  };

  deleteFilter = () => {
    const {
      notify,
      modals: {
        confirmActionModal,
      },
      filterSetType,
      filterSetsQuery: {
        data,
        refetch,
      },
      deleteFilterSetMutation,
      resetFilters,
    } = this.props;

    const { selectedFilter } = this.state;

    const {
      common,
      favourite,
    } = data?.filterSets || {};

    confirmActionModal.show({
      uuid: selectedFilter,
      onSubmit: async () => {
        try {
          await deleteFilterSetMutation({ variables: { uuid: selectedFilter } });

          notify({
            level: 'success',
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('FILTER_SET.REMOVE_FILTER.SUCCESS'),
          });

          confirmActionModal.hide();
          await refetch({ type: filterSetType });

          this.selectFilter('');
          resetFilters();
        } catch (e) {
          const error = parseErrors(e);

          notify({
            level: 'error',
            title: I18n.t('FILTER_SET.REMOVE_FILTER.ERROR'),
            message:
              error.message || I18n.t('COMMON.SOMETHING_WRONG'),
          });
        }
      },
      modalTitle: I18n.t('FILTER_SET.REMOVE_MODAL.TITLE'),
      actionText: I18n.t('FILTER_SET.REMOVE_MODAL.TEXT'),
      fullName: [...favourite, ...common].find(
        ({ uuid }) => uuid === selectedFilter,
      ).name,
      submitButtonLabel: I18n.t('FILTER_SET.REMOVE_MODAL.BUTTON_ACTION'),
    });
  };

  renderFilterSetsButtons = () => {
    const {
      disabled,
      currentValues,
      filterSetsQuery,
    } = this.props;

    const {
      selectedFilter,
      filterSetsLoading,
    } = this.state;

    if (currentValues && Object.keys(currentValues).length > 0) {
      return (
        <FilterSetsButtons
          hasSelectedFilter={!!selectedFilter}
          disabled={disabled || filterSetsLoading || filterSetsQuery.loading || filterSetsQuery.error}
          createFilter={this.createFilter}
          updateFilter={this.updateFilter}
          deleteFilter={this.deleteFilter}
        />
      );
    }

    return null;
  };

  render() {
    const {
      children,
      disabled,
      filterSetsQuery,
    } = this.props;

    const {
      selectedFilter,
      filterSetsLoading,
    } = this.state;

    const {
      common,
      favourite,
    } = filterSetsQuery.data?.filterSets || {};

    const filtersList = [...(favourite || []), ...(common || [])];
    const filtersListDisabled = disabled || filterSetsLoading || filterSetsQuery.loading || filterSetsQuery.error;

    return (
      <FilterSetsToggler>
        {({ filtersVisible, renderTrigger }) => (
          <>
            <div className={classNames('filter-favorites', { 'is-filters-visible': filtersVisible })}>
              <FilterSets
                filtersList={filtersList}
                selectedFilter={selectedFilter}
                disabled={filtersListDisabled}
                selectFilter={this.fetchFilterByUuid}
                updateFavouriteFilter={this.updateFavouriteFilter}
              />
              {renderTrigger()}
            </div>
            <If condition={filtersVisible}>
              {children({
                renderFilterSetsButtons: this.renderFilterSetsButtons,
              })}
            </If>
          </>
        )}
      </FilterSetsToggler>
    );
  }
}

export default compose(
  withApollo,
  withNotifications,
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
