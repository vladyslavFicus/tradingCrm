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

    this.state = {
      filters: {},
    };
  }

  recognizeHeaders(grids) {
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
  }

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
    this.props.onPageChange(eventKey, this.state.filters);
  }

  render() {
    let grids = React.Children.toArray(this.props.children).filter((child) => {
      return child.type.name === 'GridColumn';
    });

    return <div className="row">
      <div className="col-md-12">
        <table className={classList.table}>
          <thead className={classList.thead}>
          {this.renderHead(this.recognizeHeaders(grids))}
          {this.renderFilters(this.recognizeFilters(grids))}
          </thead>
          <tbody>
          {this.renderBody(grids)}
          </tbody>
        </table>

        {this.renderPagination()}
      </div>
    </div>;
  }

  renderHead(columns) {
    return <tr>
      {columns.map((item, key) => <th key={key} {...item}/>)}
    </tr>;
  }

  renderFilters(columns) {
    return <tr>
      {columns.map((item, key) =>
        !!item ?
          <td key={key} {...item}/> :
          <td key={key}/>
      )}
    </tr>;
  }

  renderBody(columns) {
    const { dataSource } = this.props;

    return dataSource.map((data, key) => this.renderRow(key, columns, data));
  }

  renderRow(key, columns, data) {
    return <tr key={key}>
      {columns.map((column, columnKey) => this.renderColumn(`${key}-${columnKey}`, column, data))}
    </tr>;
  }

  renderColumn(key, column, data) {
    let content = null;

    if (typeof column.props.render === 'function') {
      content = column.props.render.call(null, data, column.props, this.state.filters);
    } else if (typeof column.props.name === 'string') {
      content = data[column.props.name];
    }

    return <td className={column.props.className} key={key}>{content}</td>;
  }

  renderPagination() {
    const { activePage, totalPages } = this.props;

    if (totalPages < 2) {
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
          items={totalPages}
          maxButtons={5}
          activePage={activePage}
          onSelect={this.handlePageChange}
          className="b3-pagination"
        />
      </div>
    </div>;
  }
}

GridView.propTypes = {
  onFiltersChanged: PropTypes.func,
  onPageChange: PropTypes.func,
  dataSource: PropTypes.array.isRequired,
  activePage: PropTypes.number,
  totalPages: PropTypes.number,
};

export default GridView;
