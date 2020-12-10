import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { compose } from 'react-apollo';
import { withModals, withNotifications } from 'hoc';
import { withRequests, parseErrors } from 'apollo';
import PropTypes from 'constants/propTypes';
import ActionFilterModal from 'modals/ActionFilterModal';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import FilterSetsButtons from './components/FilterSetsButtons';
import FilterSets from './components/FilterSets';
import {
  FilterSetsQuery,
  DeleteFilterSetMutation,
} from './graphql';
import { ReactComponent as SwitcherIcon } from './icons/switcher.svg';

class FilterSetsDecorator extends PureComponent {
  static propTypes = {
    notify: PropTypes.func.isRequired,
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
    filtersVisible: true,
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

  toggleVisibility = () => (
    this.setState(({ filtersVisible }) => ({
      filtersVisible: !filtersVisible,
    }))
  );

  renderFilterSetsButtons = () => {
    const {
      currentValues,
      filterSetsQuery: {
        loading,
        error,
      },
    } = this.props;

    if (currentValues && Object.keys(currentValues).length > 0) {
      return (
        <FilterSetsButtons
          hasSelectedFilter={!!this.state.selectedFilter}
          disabled={loading || error}
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
      filterSetType,
      disabled,
      submitFilters,
    } = this.props;

    const {
      selectedFilter,
      filtersVisible,
    } = this.state;

    return (
      <>
        <div className={classNames('filter-favorites', { 'is-filters-visible': filtersVisible })}>
          <FilterSets
            filterSetType={filterSetType}
            selectedFilter={selectedFilter}
            disabled={disabled}
            submitFilters={submitFilters}
            selectFilter={this.selectFilter}
          />
          <div
            className={classNames('filter-switcher', { 'is-closed': !filtersVisible })}
            onClick={this.toggleVisibility}
          >
            <SwitcherIcon />
          </div>
        </div>
        <If condition={filtersVisible}>
          {children({
            renderFilterSetsButtons: this.renderFilterSetsButtons,
          })}
        </If>
      </>
    );
  }
}

export default compose(
  withNotifications,
  withModals({
    actionFilterModal: ActionFilterModal,
    confirmActionModal: ConfirmActionModal,
  }),
  withRequests({
    filterSetsQuery: FilterSetsQuery,
    deleteFilterSetMutation: DeleteFilterSetMutation,
  }),
)(FilterSetsDecorator);
