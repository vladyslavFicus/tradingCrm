import React, { Component } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import ClientsGridFilter from './ClientsGridFilter';
import ClientsGrid from './ClientsGrid';
import ClientsGridHeader from './ClientsGridHeader';

const MAX_SELECTED_ROWS = 2000;

class List extends Component {
  static propTypes = {
    ...PropTypes.router,
    profiles: PropTypes.query({
      profiles: PropTypes.pageable(PropTypes.profileView),
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
    allRowsSelected: false,
    touchedRowsIds: [],
  };

  resetClientsGridInitialState = (cb) => {
    this.setState(
      {
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

  handleSelectRow = (allRowsSelected, touchedRowsIds) => {
    this.setState({
      touchedRowsIds,
      allRowsSelected,
    });
  };

  handleAllRowsSelect = (allRowsSelected) => {
    this.setState({ allRowsSelected, touchedRowsIds: [] });

    if (allRowsSelected) {
      const {
        profiles,
        location,
        modals: { confirmationModal },
      } = this.props;

      const totalElements = get(profiles, 'profiles.totalElements');
      const searchLimit = get(location, 'query.filters.searchLimit');

      let selectedLimit = totalElements > MAX_SELECTED_ROWS;

      if (searchLimit && (searchLimit < totalElements)) {
        selectedLimit = searchLimit > MAX_SELECTED_ROWS;
      }

      if (selectedLimit) {
        confirmationModal.show({
          onSubmit: confirmationModal.hide,
          modalTitle: `${MAX_SELECTED_ROWS} ${I18n.t('COMMON.CLIENTS_SELECTED')}`,
          actionText: I18n.t('COMMON.NOT_MORE_CAN_SELECTED', { max: MAX_SELECTED_ROWS }),
          submitButtonLabel: I18n.t('COMMON.OK'),
        });
      }
    }
  };

  getSelectedRowLength = () => {
    const { allRowsSelected, touchedRowsIds } = this.state;

    let selectedRowsLength = touchedRowsIds.length;

    if (allRowsSelected) {
      const { profiles, location } = this.props;

      const totalElements = get(profiles, 'profiles.totalElements');
      const searchLimit = get(location, 'query.filters.searchLimit');

      const selectedLimit = searchLimit && (searchLimit < totalElements) ? searchLimit : totalElements;

      selectedRowsLength = selectedLimit > MAX_SELECTED_ROWS
        ? MAX_SELECTED_ROWS - selectedRowsLength
        : selectedLimit - selectedRowsLength;
    }

    return selectedRowsLength;
  };

  render() {
    const {
      profiles,
      profiles: { loading },
      location: { filterSetValues, query },
    } = this.props;

    const {
      allRowsSelected,
      touchedRowsIds,
    } = this.state;

    const searchLimit = get(query, 'filters.searchLimit');

    const selectedRowsLength = this.getSelectedRowLength();

    return (
      <div className="card">
        <ClientsGridHeader
          profiles={profiles}
          searchLimit={searchLimit}
          touchedRowsIds={touchedRowsIds}
          allRowsSelected={allRowsSelected}
          selectedRowsLength={selectedRowsLength}
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
