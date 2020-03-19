import React, { Component } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import ClientsGridFilter from './ClientsGridFilter';
import ClientsGrid from './ClientsGrid';
import ClientsGridHeader from './ClientsGridHeader';

const MAX_SELECTED_ROWS = 10000;

class List extends Component {
  static propTypes = {
    ...PropTypes.router,
    profiles: PropTypes.query({
      profiles: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.profileView),
      }),
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        filters: PropTypes.object,
      }),
      filterSetValues: PropTypes.object,
    }).isRequired,
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
      representativeModal: PropTypes.modalType,
      moveModal: PropTypes.modalType,
    }).isRequired,
  };

  state = {
    selectedRows: [],
    allRowsSelected: false,
    touchedRowsIds: [],
  };

  resetClientsGridInitialState = (cb) => {
    this.setState(
      {
        selectedRows: [],
        allRowsSelected: false,
        touchedRowsIds: [],
      },
      () => cb && cb(),
    );
  };

  handleFiltersChanged = async (filters = {}) => {
    const {
      history,
      location: { filterSetValues },
    } = this.props;

    this.resetClientsGridInitialState(() => {
      history.replace({
        ...(filterSetValues && { filterSetValues }),
        query: { filters },
      });
    });
  };

  handleFilterReset = () => {
    this.resetClientsGridInitialState(() => {
      this.props.history.replace({ query: null });
    });
  };

  handleSelectRow = (isAllRowsSelected, rowIndex, touchedRowsIds) => {
    this.setState((state) => {
      const selectedRows = [...state.selectedRows];

      if (isAllRowsSelected) {
        selectedRows.push(rowIndex);
      } else {
        const unselectedRowIndex = selectedRows.findIndex(
          item => item === rowIndex,
        );
        selectedRows.splice(unselectedRowIndex, 1);
      }

      return {
        selectedRows,
        touchedRowsIds,
      };
    });
  };

  handleAllRowsSelect = () => {
    const {
      profiles,
      location: { query },
      modals: { confirmationModal },
    } = this.props;

    const { allRowsSelected } = this.state;
    const { totalElements } = get(profiles, 'profiles.data') || {};
    const { searchLimit } = get(query, 'filters') || {};

    let selectedRowsLength = null;

    if (searchLimit && searchLimit < totalElements && searchLimit < MAX_SELECTED_ROWS) {
      selectedRowsLength = searchLimit;
    } else if (totalElements > MAX_SELECTED_ROWS) {
      selectedRowsLength = MAX_SELECTED_ROWS;
    } else {
      selectedRowsLength = totalElements;
    }

    this.setState({
      allRowsSelected: !allRowsSelected,
      touchedRowsIds: [],
      selectedRows: allRowsSelected
        ? []
        : [...Array.from(Array(selectedRowsLength).keys())],
    });

    // Check if selected all rows and total elements more than max available elements to execute action
    if (!allRowsSelected) {
      let showModal = false;

      if (searchLimit) {
        if (searchLimit > MAX_SELECTED_ROWS && totalElements > MAX_SELECTED_ROWS) {
          showModal = true;
        }
      } else if (totalElements > MAX_SELECTED_ROWS) {
        showModal = true;
      }

      if (showModal) {
        confirmationModal.show({
          onSubmit: confirmationModal.hide,
          modalTitle: `${MAX_SELECTED_ROWS} ${I18n.t('COMMON.CLIENTS_SELECTED')}`,
          actionText: I18n.t('COMMON.NOT_MORE_CAN_SELECTED', {
            max: MAX_SELECTED_ROWS,
          }),
          submitButtonLabel: I18n.t('COMMON.OK'),
        });
      }
    }
  };

  render() {
    const {
      profiles,
      profiles: { loading },
      location: { filterSetValues, query },
    } = this.props;

    const {
      allRowsSelected,
      selectedRows,
      touchedRowsIds,
    } = this.state;

    const { searchLimit } = get(query, 'filters') || {};

    return (
      <div className="card">
        <ClientsGridHeader
          profiles={profiles}
          searchLimit={searchLimit}
          selectedRows={selectedRows}
          touchedRowsIds={touchedRowsIds}
          allRowsSelected={allRowsSelected}
          resetClientsGridInitialState={this.resetClientsGridInitialState}
        />

        <ClientsGridFilter
          isFetchingProfileData={loading}
          initialValues={filterSetValues}
          onReset={this.handleFilterReset}
          onSubmit={this.handleFiltersChanged}
        />

        <div className="card-body card-grid-multiselect">
          <ClientsGrid
            profiles={profiles}
            searchLimit={searchLimit}
            touchedRowsIds={touchedRowsIds}
            allRowsSelected={allRowsSelected}
            handleAllRowsSelect={this.handleAllRowsSelect}
            handleSelectRow={this.handleSelectRow}
          />
        </div>
      </div>
    );
  }
}

export default List;
