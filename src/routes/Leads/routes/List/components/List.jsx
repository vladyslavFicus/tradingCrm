import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import LeadsGridFilter from './LeadsGridFilter';
import history from '../../../../../router/history';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import Placeholder from '../../../../../components/Placeholder';
import FileUpload from '../../../../../components/FileUpload';
import withPlayerClick from '../../../../../utils/withPlayerClick';
import getColumns from './utils';
import { fileConfig } from './constants';

class List extends Component {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    countries: PropTypes.object.isRequired,
    leads: PropTypes.shape({
      leads: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.lead),
      }),
      loadMore: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        filters: PropTypes.object,
      }),
    }).isRequired,
    fileUpload: PropTypes.func.isRequired,
  };

  static contextTypes = {
    miniProfile: PropTypes.shape({
      onShowMiniProfile: PropTypes.func.isRequired,
    }),
  };

  state = {
    selectedRows: [],
    allRowsSelected: false,
    touchedRowsIds: [],
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

  handlePageChanged = () => {
    const {
      leads: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({
      allRowsSelected: false,
      selectedRows: [],
      touchedRowsIds: [],
    }, () => history.replace({ query: { filters } }));
  }

  handleFilterReset = () => {
    this.setState({
      allRowsSelected: false,
      selectedRows: [],
      touchedRowsIds: [],
    }, () => history.replace({ query: { filters: {} } }));
  };

  handleLeadClick = ({ id }) => {
    history.push(`/leads/${id}`);
  };

  handleSelectedRow = (condition, index, touchedRowsIds) => {
    const { leads: { leads: { data: { content } } } } = this.props;
    const selectedRows = [...this.state.selectedRows];

    if (condition) {
      selectedRows.push(content[index].playerUUID);
    } else {
      selectedRows.splice(index, 1);
    }

    this.setState({
      selectedRows,
      touchedRowsIds,
    });
  };

  handleAllRowsSelect = () => {
    const { leads: { leads: { data: { totalElements } } } } = this.props;
    const { allRowsSelected } = this.state;

    this.setState({
      allRowsSelected: !allRowsSelected,
      touchedRowsIds: [],
      selectedRows: allRowsSelected
        ? []
        : [...Array.from(Array(totalElements).keys())],
    });
  };

  handleUploadCSV = async (errors, file) => {
    if (errors.length > 0) {
      this.props.notify({
        level: 'error',
        title: I18n.t('COMMON.UPLOAD_FAILED'),
        message: errors.join(', '),
      });

      return;
    }
    const action = await this.props.fileUpload({ variables: { file } });

    if (action.error) {
      this.props.notify({
        level: 'error',
        title: I18n.t('COMMON.UPLOAD_FAILED'),
        message: action.error || action.field_errors || I18n.t('COMMON.SOMETHING_WRONG'),
      });

      return;
    }

    this.props.notify({
      level: 'success',
      title: I18n.t('COMMON.SUCCESS'),
      message: I18n.t('COMMON.UPLOAD_SUCCESSFUL'),
    });
  }

  render() {
    const {
      locale,
      currencies,
      countries,
      leads: {
        loading,
        leads,
      },
      location: { query },
    } = this.props;

    const {
      allRowsSelected,
      selectedRows,
      touchedRowsIds,
    } = this.state;

    const entities = get(this.props.leads, 'leads.data') || { content: [] };
    const filters = get(query, 'filters', {});

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!loading && !!leads}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
              </div>
            )}
          >
            <Choose>
              <When condition={!!entities.totalElements}>
                <span className="font-size-20 height-55 users-list-header">
                  <div>
                    <strong>{entities.totalElements} </strong>
                    {I18n.t('LEADS.LEADS_FOUND')}
                  </div>
                  <div className="font-size-14">
                    <strong>{selectedRows.length} </strong>
                    {I18n.t('LEADS.LEADS_SELECTED')}
                  </div>
                </span>
              </When>
              <Otherwise>
                <span className="font-size-20">
                  {I18n.t('LEADS.LEADS')}
                </span>
              </Otherwise>
            </Choose>
          </Placeholder>

          <If condition={entities.totalElements !== 0 && selectedRows.length !== 0}>
            <div className="grid-bulk-menu ml-auto">
              <span>Bulk actions</span>
              <button
                className="btn btn-default-outline"
                // onClick={this.handleSales}
              >
                {I18n.t('COMMON.SALES')}
              </button>
              <button
                className="btn btn-default-outline"
                // onClick={this.handleRetention}
              >
                {I18n.t('COMMON.RETENTION')}
              </button>
              <button
                className="btn btn-default-outline"
                // onClick={this.handleCompliance}
              >
                {I18n.t('COMMON.COMPLIANCE')}
              </button>
              <button
                className="btn btn-default-outline"
                // onClick={this.handleMove}
              >
                {I18n.t('COMMON.MOVE')}
              </button>
              <button
                className="btn btn-default-outline"
                // onClick={this.changeStatus}
              >
                {I18n.t('COMMON.CHANGE_STATUS')}
              </button>
              <button
                className="btn btn-default-outline"
                // onClick={this.handleExportSelected}
              >
                {I18n.t('COMMON.EXPORT_SELECTED')}
              </button>
            </div>
          </If>
          <If condition={selectedRows.length === 0}>
            <div className="ml-auto">
              <FileUpload
                label={I18n.t('COMMON.UPLOAD')}
                allowedSize={fileConfig.maxSize}
                allowedTypes={fileConfig.types}
                onChosen={this.handleUploadCSV}
              />
              <button
                disabled={!allowActions}
                className="btn btn-default-outline margin-left-15"
                onClick={this.handleExport}
                type="button"
              >
                {I18n.t('COMMON.EXPORT')}
              </button>
            </div>
          </If>
        </div>

        <LeadsGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
          currencies={currencies}
          countries={countries}
        />

        <div className="card-body card-grid-multiselect">
          <GridView
            tableClassName="table-hovered"
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.page}
            last={entities.last}
            lazyLoad
            multiselect
            selectedRows={selectedRows}
            allRowsSelected={allRowsSelected}
            touchedRowsIds={touchedRowsIds}
            onAllRowsSelect={this.handleAllRowsSelect}
            onRowSelect={this.handleSelectedRow}
            locale={locale}
            showNoResults={!loading && entities.content.length === 0}
            onRowClick={this.handleLeadClick}
          >
            {getColumns(I18n).map(({ name, header, render }) => (
              <GridViewColumn
                key={name}
                name={name}
                header={header}
                render={render}
              />
            ))}
          </GridView>
        </div>
      </div>
    );
  }
}

export default withPlayerClick(List);
