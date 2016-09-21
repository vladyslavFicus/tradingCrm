import React, { Component, PropTypes } from 'react';
import { Pagination } from 'react-bootstrap';
import classNames from 'classnames';

const classList = {
  table: classNames('table table-stripped table-hovered'),
  thead: 'thead-default',
};

class GridView extends Component {
  constructor(props) {
    super(props);

    this.renderHead = this.renderHead.bind(this);
    this.renderFilters = this.renderFilters.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderColumn = this.renderColumn.bind(this);
    this.renderPagination = this.renderPagination.bind(this);

    this.setFilters = this.setFilters.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

    let grids = React.Children.toArray(this.props.children).filter((child) => {
      return child.type.name === 'GridColumn';
    });

    this.state = {
      filters: {},
      headerColumns: this.recognizeHeaders(grids),
      filterColumns: this.recognizeFilters(grids),
    };
  }

  recognizeHeaders(grids) {
    return grids.map(({ props }) => {
      const config = { name: props.header };
      if (props.headerClassName) {
        config.className = props.headerClassName;
      }

      return config;
    });
  }

  recognizeFilters(grids) {
    return grids.map(({ props }) => {
      if (typeof props.filter === 'function') {
        const config = { filter: props.filter(this.setFilters) };

        if (props.filterClassName) {
          config.className = props.filterClassName;
        }

        return config;
      }

      return null;
    });
  }

  setFilters(filters) {
    return this.setState({
      filters: {
        ...this.state.filters,
        ...filters,
      },
    }, this.onFiltersChanged);
  }

  onFiltersChanged() {
    this.props.onFiltersChanged(this.state.filters);
  }

  handlePageChange(eventKey) {
    this.props.onPageChange(eventKey);
  }

  render() {
    return <div className="row">
      <div className="col-md-12">
        <table className={classList.table}>
          <thead className={classList.thead}>
          {this.renderHead()}
          {this.renderFilters()}
          </thead>
          <tbody>
          {this.renderBody()}
          </tbody>
        </table>

        {this.renderPagination()}
      </div>
    </div>;
  }

  renderHead() {
    const { headerColumns } = this.state;

    return <tr>
      {headerColumns.map((item, key) => <th
        className={item.className}
        key={key}
      >
        {item.name}
      </th>)}
    </tr>;
  }

  renderFilters() {
    const { filterColumns } = this.state;

    return <tr>
      {filterColumns.map((item, key) =>
        item ?
          <td className={item.className} key={key}>{item.filter}</td> :
          <td key={key}/>
      )}
    </tr>;
  }

  renderBody() {
    const { dataSource, columns } = this.props;

    return dataSource.map((data, key) => this.renderRow(key, columns, data));
  }

  renderRow(key, columns, data) {
    return <tr key={key}>
      {columns.map((column, columnKey) => this.renderColumn(`${key}-${columnKey}`, column, data))}
    </tr>;
  }

  renderColumn(key, column, data) {
    let content = null;

    if (typeof column.value === 'function') {
      content = column.value.call(null, data, column);
    } else if (typeof column.name === 'string') {
      content = data[column.name];
    }

    return <td key={key}>{content}</td>;
  }

  renderPagination() {
    const { dataSource } = this.props;

    if (dataSource.totalPages < 1) {
      return null;
    }

    return <div className="row">
      <div className="col-md-12">
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          items={dataSource.totalPages}
          maxButtons={5}
          activePage={dataSource.number + 1}
          onSelect={this.handlePageChange}
        />
      </div>
    </div>;
  }
}

GridView.propTypes = {
  onFiltersChanged: PropTypes.func,
  onPageChange: PropTypes.func,
  dataSource: PropTypes.array.isRequired,
};

export default GridView;
