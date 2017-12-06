import { Pagination } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import GridColumn from './GridColumn';
import shallowEqual from '../../utils/shallowEqual';
import NotFoundContent from '../../components/NotFoundContent';
import PermissionContent from '../PermissionContent';

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
    summaryRow: PropTypes.object,
    rowClassName: PropTypes.func,
    lazyLoad: PropTypes.bool,
    locale: PropTypes.string,
    showNoResults: PropTypes.bool,
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
    showNoResults: false,
  };

  state = {
    filters: this.props.defaultFilters || {},
  };

  shouldComponentUpdate(nextProps) {
    if (!nextProps.lazyLoad) {
      return true;
    }

    return !shallowEqual(nextProps.dataSource, this.props.dataSource)
      || (nextProps.locale !== this.props.locale) || nextProps.showNoResults !== this.props.showNoResults;
  }

  onFiltersChanged = () => {
    this.props.onFiltersChanged(this.state.filters);
  };

  setFilters = filters => this.setState({
    filters: {
      ...this.state.filters,
      ...filters,
    },
  }, this.onFiltersChanged);

  getRowClassName = (data) => {
    let className = this.props.rowClassName;

    if (typeof className === 'function') {
      className = className(data);
    }

    return className;
  };

  getGridColumn = child => (child.type === PermissionContent && child.props.children.type === GridColumn
    ? child.props.children.props
    : child.props);

  recognizeHeaders = grids => grids.map((child) => {
    const gridColumn = this.getGridColumn(child);

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
    const gridColumn = this.getGridColumn(child);

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

  handlePageChange = (eventKey) => {
    const { totalPages, activePage, onPageChange } = this.props;

    if (totalPages > activePage) {
      onPageChange(eventKey, this.state.filters);
    }
  };

  renderHead = columns => (
    <tr>
      {columns.map((item, key) => <th key={key} {...item} />)}
    </tr>
  );

  renderFilters = columns => (
    columns.some(column => !!column)
      ? (
        <tr>
          {columns.map((item, key) => (item ? <td key={key} {...item} /> : <td key={key} />))}
        </tr>
      )
      : null
  );

  renderLoader = columns => (
    <tr className="infinite-preloader">
      <td colSpan={columns.length}>
        <img src="/img/infinite_preloader.svg" alt="preloader" />
      </td>
    </tr>
  );

  renderBody = (columns) => {
    const {
      dataSource,
      lazyLoad,
      totalPages,
      activePage,
    } = this.props;

    const rows = dataSource.map((data, key) => this.renderRow(key, columns, data));

    if (lazyLoad) {
      return (
        <InfiniteScroll
          loadMore={() => this.handlePageChange(activePage + 1)}
          element="tbody"
          hasMore={totalPages > activePage}
          loader={this.renderLoader(columns)}
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
        className={this.getRowClassName(data)}
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
    const gridColumn = this.getGridColumn(column);
    let content = null;

    if (typeof gridColumn.render === 'function') {
      content = gridColumn.render.call(null, data, gridColumn, this.state.filters);
    } else if (typeof gridColumn.name === 'string') {
      content = data[gridColumn.name];
    }

    return <td className={gridColumn.className} key={key}>{content}</td>;
  }

  renderFooter(columns) {
    const { summaryRow } = this.props;

    if (!summaryRow) {
      return null;
    }

    return (
      <tfoot>
        <tr>
          {columns.map(({ props }, key) =>
            <td key={key}>{summaryRow[props.name]}</td>
          )}
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
    } = this.props;

    if (showNoResults) {
      return <NotFoundContent locale={locale} />;
    }

    if (!dataSource.length) {
      return null;
    }

    const grids = React.Children
      .toArray(this.props.children)
      .filter(child => child.type === GridColumn || child.type === PermissionContent);

    return (
      <div className="table-responsive">
        <table className={classNames('table data-grid-layout', tableClassName)}>
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
