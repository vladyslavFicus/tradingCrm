import { Pagination } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shallowEqual from '../../utils/shallowEqual';
import GridViewColumn from './GridViewColumn';
import NotFoundContent from '../NotFoundContent';
import PermissionContent from '../PermissionContent';
import GridViewLoader from './GridViewLoader';
import { getGridColumn } from './utils';

class GridView extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    tableClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    onFiltersChanged: PropTypes.func,
    onPageChange: PropTypes.func,
    onRowClick: PropTypes.func,
    defaultFilters: PropTypes.object,
    dataSource: PropTypes.array.isRequired,
    activePage: PropTypes.number,
    totalPages: PropTypes.number,
    last: PropTypes.bool,
    summaryRow: PropTypes.object,
    rowClassName: PropTypes.func,
    lazyLoad: PropTypes.bool,
    loading: PropTypes.bool,
    locale: PropTypes.string,
    showNoResults: PropTypes.bool,
    multiselect: PropTypes.bool,
    allRowsSelected: PropTypes.bool,
    touchedRowsIds: PropTypes.array,
    onAllRowsSelect: PropTypes.func,
    onRowSelect: PropTypes.func,
  };

  static defaultProps = {
    tableClassName: null,
    headerClassName: 'text-uppercase',
    defaultFilters: {},
    summaryRow: null,
    locale: null,
    onFiltersChanged: null,
    onPageChange: null,
    onRowClick: null,
    activePage: null,
    totalPages: null,
    rowClassName: null,
    lazyLoad: false,
    loading: false,
    showNoResults: false,
    last: true,
    multiselect: false,
    allRowsSelected: false,
    touchedRowsIds: [],
    onAllRowsSelect: null,
    onRowSelect: null,
  };

  state = {
    filters: this.props.defaultFilters || {},
  };

  shouldComponentUpdate(nextProps) {
    if (!nextProps.lazyLoad) {
      return true;
    }

    return !shallowEqual(nextProps.dataSource, this.props.dataSource)
      || nextProps.locale !== this.props.locale
      || nextProps.showNoResults !== this.props.showNoResults
      || this.props.touchedRowsIds.length !== nextProps.touchedRowsIds.length
      || this.props.allRowsSelected !== nextProps.allRowsSelected
      || nextProps.loading !== this.props.loading
      || nextProps.totalPages !== this.props.totalPages
      || nextProps.last !== this.props.last;
  }

  onFiltersChanged = () => {
    this.props.onFiltersChanged(this.state.filters);
  };

  setFilters = filters => this.setState(state => ({
    filters: {
      ...state.filters,
      ...filters,
    },
  }), this.onFiltersChanged);

  getRowClassName = (data) => {
    let className = this.props.rowClassName;

    if (typeof className === 'function') {
      className = className(data);
    }

    return className;
  };

  getRowState = (rowId) => {
    const {
      touchedRowsIds,
      allRowsSelected,
    } = this.props;

    if (touchedRowsIds.length === 0) {
      return allRowsSelected;
    }

    const isRowTouched = touchedRowsIds.findIndex(item => item === rowId);

    return allRowsSelected ? isRowTouched === -1 : isRowTouched !== -1;
  };

  recognizeHeaders = grids => grids.map((child) => {
    const gridColumn = getGridColumn(child);

    const config = {
      children: typeof gridColumn.header === 'function'
        ? gridColumn.header()
        : gridColumn.header,
    };

    if (gridColumn.headerClassName) {
      config.className = gridColumn.headerClassName;
    }

    if (gridColumn.headerStyle) {
      config.style = gridColumn.headerStyle;
    }

    return config;
  });

  recognizeFilters = grids => grids.map((child) => {
    const gridColumn = getGridColumn(child);

    if (typeof gridColumn.filter === 'function') {
      const config = { children: gridColumn.filter(this.setFilters) };

      if (gridColumn.filterClassName) {
        config.className = gridColumn.filterClassName;
      }

      if (gridColumn.filterStyle) {
        config.style = gridColumn.filterStyle;
      }

      return config;
    }

    return null;
  });

  handleSelectRow = (e) => {
    e.stopPropagation();

    const touchedRowsIds = [...this.props.touchedRowsIds];
    const { allRowsSelected } = this.props;

    const [, rowIndex] = e.target.id.split('-');
    const index = touchedRowsIds.findIndex(item => item === rowIndex);

    if (index === -1) {
      touchedRowsIds.push(rowIndex);
      this.props.onRowSelect(!allRowsSelected, rowIndex, touchedRowsIds);
    } else {
      touchedRowsIds.splice(index, 1);
      this.props.onRowSelect(allRowsSelected, index, touchedRowsIds);
    }
  };

  handlePageChange = (eventKey) => {
    const {
      totalPages,
      activePage,
      onPageChange,
      last,
    } = this.props;

    const hasMore = totalPages && activePage ? totalPages > activePage : !last;

    if (typeof onPageChange === 'function' && hasMore) {
      onPageChange(eventKey, this.state.filters);
    }
  };

  renderHead = columns => (
    <tr>
      {columns.map((item, key) => (
        <Choose>
          <When condition={this.props.multiselect && key === 0 && !this.props.loading}>
            <th key={key} {...item}>
              <span
                className={classNames(
                  'grid-select-checkbox',
                  { 'header-unselect': (this.props.allRowsSelected && this.props.touchedRowsIds.length !== 0) },
                  { active: (this.props.allRowsSelected && this.props.touchedRowsIds.length === 0) },
                )}
                onClick={this.props.onAllRowsSelect}
              />
              {item.children}
            </th>
          </When>
          <Otherwise>
            <th key={key} {...item} />
          </Otherwise>
        </Choose>
      ))}
    </tr>
  );

  renderFilters = columns => (
    <If condition={columns.some(column => !!column)}>
      <tr>
        {columns.map((item, key) => (
          <Choose>
            <When condition={item}>
              <td key={key} {...item} />
            </When>
            <Otherwise>
              <td key={key} />
            </Otherwise>
          </Choose>
        ))}
      </tr>
    </If>
  );

  renderLoading = columns => (
    <GridViewLoader key="loading" className="infinite-preloader no-border-bottom" colSpan={columns.length} />
  );

  renderBody = (columns) => {
    const {
      dataSource,
      lazyLoad,
      loading,
      totalPages,
      activePage,
      last,
    } = this.props;

    const rows = dataSource.map((data, key) => this.renderRow(key, columns, data));
    const hasMore = totalPages && activePage ? totalPages > activePage : !last;

    if (loading) {
      return <tbody>{this.renderLoading(columns)}</tbody>;
    }

    if (lazyLoad) {
      return (
        <InfiniteScroll
          loadMore={() => this.handlePageChange(activePage + 1)}
          element="tbody"
          hasMore={hasMore}
          loader={this.renderLoading(columns)}
        >
          {rows}
        </InfiniteScroll>
      );
    }

    return <tbody>{rows}</tbody>;
  };

  renderRow = (key, columns, data) => {
    const { onRowClick } = this.props;
    return (
      <tr
        key={key}
        className={classNames(
          this.getRowClassName(data),
          { selected: this.getRowState(key.toString()) },
        )}
        onClick={() => {
          if (typeof onRowClick === 'function') {
            onRowClick(data);
          }
        }}
      >
        {columns.map((column, columnKey) => this.renderColumn(`${key}-${columnKey}`, column, data))}
      </tr>
    );
  };

  renderColumn(key, column, data) {
    const { multiselect } = this.props;

    const gridColumn = getGridColumn(column);
    const [rowIndex, columnKey] = key.split('-');
    const isFirstColumn = !Number(columnKey);
    let content = null;
    let active = false;

    if (multiselect) {
      active = this.getRowState(rowIndex);
    }

    if (typeof gridColumn.render === 'function') {
      content = gridColumn.render.call(null, data, gridColumn, this.state.filters);
    } else if (typeof gridColumn.name === 'string') {
      content = data[gridColumn.name];
    }

    return (
      <td className={gridColumn.className} key={key}>
        <If condition={multiselect && isFirstColumn}>
          <span
            className={classNames(
              'grid-select-checkbox',
              { active },
            )}
            onClick={this.handleSelectRow}
            id={`checkbox-${rowIndex}`}
          />
        </If>
        {content}
      </td>
    );
  }

  renderFooter(columns) {
    const { summaryRow } = this.props;

    if (!summaryRow) {
      return null;
    }

    return (
      <tfoot>
        <tr>
          {columns.map(({ props }, key) => (
            <td key={key}>{summaryRow[props.name]}</td>
          ))}
        </tr>
      </tfoot>
    );
  }

  renderPagination() {
    const { activePage, totalPages } = this.props;

    if (totalPages < 2) {
      return null;
    }

    return (
      <div>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          items={totalPages}
          maxButtons={5}
          activePage={activePage}
          onSelect={this.handlePageChange}
          className="b3-pagination"
        />
      </div>
    );
  }

  render() {
    const {
      tableClassName,
      headerClassName,
      lazyLoad,
      showNoResults,
      dataSource,
      locale,
      loading,
      multiselect,
    } = this.props;

    if (!loading && showNoResults) {
      return <NotFoundContent locale={locale} />;
    }

    if (!loading && !dataSource.length) {
      return null;
    }

    const grids = React.Children
      .toArray(this.props.children)
      .filter(child => child.type === GridViewColumn || child.type === PermissionContent);

    return (
      <div className="table-responsive">
        <table
          className={classNames(
            'table data-grid-layout',
            tableClassName,
            { multiselect },
          )}
        >
          <thead className={headerClassName}>
            {this.renderHead(this.recognizeHeaders(grids))}
            {this.renderFilters(this.recognizeFilters(grids))}
          </thead>
          {this.renderBody(grids)}
          {this.renderFooter(grids)}
        </table>

        {!lazyLoad && this.renderPagination()}
      </div>
    );
  }
}

export default GridView;
