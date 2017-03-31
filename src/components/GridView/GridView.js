import { Pagination } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import React, { Component, PropTypes } from 'react';
import GridColumn from './GridColumn';
import shallowEqual from '../../utils/shallowEqual';

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
  };

  static defaultProps = {
    tableClassName: 'table table-stripped table-hovered',
    headerClassName: 'thead-default',
    defaultFilters: {},
    summaryRow: null,
  };

  state = {
    filters: this.props.defaultFilters || {},
  };

  shouldComponentUpdate(nextProps) {
    if (!this.props.lazyLoad) {
      return true;
    }

    return !shallowEqual(nextProps.dataSource, this.props.dataSource);
  }

  onFiltersChanged() {
    this.props.onFiltersChanged(this.state.filters);
  }

  setFilters(filters) {
    return this.setState({
      filters: {
        ...this.state.filters,
        ...filters,
      },
    }, this.onFiltersChanged);
  }

  recognizeHeaders = (grids) => {
    return grids.map(({ props }) => {
      const config = { children: props.header };

      if (props.headerClassName) {
        config.className = props.headerClassName;
      }

      if (props.headerStyle) {
        config.style = props.headerStyle;
      }

      return config;
    });
  };

  recognizeFilters(grids) {
    return grids.map(({ props }) => {
      if (typeof props.filter === 'function') {
        const config = { children: props.filter(this.setFilters) };

        if (props.filterClassName) {
          config.className = props.filterClassName;
        }

        if (props.filterStyle) {
          config.style = props.filterStyle;
        }

        return config;
      }

      return null;
    });
  }

  getRowClassName = (data) => {
    let className = this.props.rowClassName;

    if (typeof className === 'function') {
      className = className(data);
    }

    return className;
  };

  handlePageChange(eventKey) {
    this.props.onPageChange(eventKey, this.state.filters);
  }

  renderHead = (columns) => {
    return (
      <tr>
        {columns.map((item, key) => <th key={key} {...item} />)}
      </tr>
    );
  };

  renderFilters(columns) {
    return columns.some(column => !!column)
      ? <tr>
        {columns.map((item, key) =>
          !!item ?
            <td key={key} {...item} /> :
            <td key={key} />
        )}
      </tr> : null;
  }

  renderBody = (columns) => {
    const {
      dataSource,
      lazyLoad,
      totalPages,
      activePage,
    } = this.props;

    const rows = dataSource.map((data, key) => this.renderRow(key, columns, data));

    return lazyLoad
      ? <InfiniteScroll
        loadMore={() => this.handlePageChange(activePage + 1)}
        element="tbody"
        hasMore={totalPages > activePage}
      >
        {rows}
      </InfiniteScroll>
      : <tbody>{rows}</tbody>;
  };

  renderRow = (key, columns, data) => {
    const { onRowClick } = this.props;

    return (
      <tr key={key} className={this.getRowClassName(data)} onClick={() => {
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
    let content = null;

    if (typeof column.props.render === 'function') {
      content = column.props.render.call(null, data, column.props, this.state.filters);
    } else if (typeof column.props.name === 'string') {
      content = data[column.props.name];
    }

    return <td className={column.props.className} key={key}>{content}</td>;
  }

  renderFooter(columns) {
    const { summaryRow } = this.props;

    return summaryRow ? <tfoot>
      <tr>
        {columns.map(({ props }, key) =>
          <td key={key}>{summaryRow[props.name]}</td>
        )}
      </tr>
    </tfoot> : null;
  }

  renderPagination() {
    const { activePage, totalPages } = this.props;

    if (totalPages < 2) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-md-12">
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
      </div>
    );
  }

  render() {
    const {
      tableClassName,
      headerClassName,
      lazyLoad,
    } = this.props;
    const grids = React.Children.toArray(this.props.children).filter((child) => {
      return child.type === GridColumn;
    });

    return (
      <div className="row">
        <div className="col-md-12">
          <table className={tableClassName}>
            <thead className={headerClassName}>
              {this.renderHead(this.recognizeHeaders(grids))}
              {this.renderFilters(this.recognizeFilters(grids))}
            </thead>

            {this.renderBody(grids)}
            {this.renderFooter(grids)}
          </table>

          {!lazyLoad && this.renderPagination()}
        </div>
      </div>
    );
  }
}

export default GridView;
