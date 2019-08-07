import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import GridViewColumn from './GridViewColumn';
import NotFoundContent from '../NotFoundContent';

class CollapseGridView extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    tableClassName: PropTypes.string,
    collapseClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    renderCollapseBlock: PropTypes.func.isRequired,
    onRowClick: PropTypes.func,
    dataSource: PropTypes.array.isRequired,
    rowClassName: PropTypes.func,
    openUUID: PropTypes.string,
    collapsedDataFieldName: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    showNoResults: PropTypes.bool,
  };

  static defaultProps = {
    tableClassName: null,
    headerClassName: 'text-uppercase',
    showNoResults: false,
    collapseClassName: null,
    onRowClick: null,
    rowClassName: null,
    openUUID: null,
  };

  getRowClassName = (data) => {
    let className = this.props.rowClassName;

    if (typeof className === 'function') {
      className = className(data);
    }

    return className;
  };

  recognizeHeaders = grids => grids.map(({ props }) => {
    const config = { children: typeof props.header === 'function' ? props.header() : props.header };

    if (props.headerClassName) {
      config.className = props.headerClassName;
    }

    if (props.headerStyle) {
      config.style = props.headerStyle;
    }

    return config;
  });

  renderHead = columns => (
    <tr>
      {columns.map((item, key) => <th key={key} {...item} />)}
    </tr>
  );

  renderBody = (columns) => {
    const rows = this.props.dataSource.map((data, key) => this.renderRow(key, columns, data));

    return <tbody>{rows}</tbody>;
  };

  renderRow = (key, columns, data) => {
    const { onRowClick, collapseClassName, collapsedDataFieldName, openUUID, renderCollapseBlock } = this.props;

    const values = [
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
      </tr>,
    ];

    if (Object.keys(data[collapsedDataFieldName]).length && openUUID && data.uuid === openUUID) {
      values.push(
        <tr
          key={`${key}-collapse`}
          className={collapseClassName}
        >
          <td colSpan={columns.length}>
            {renderCollapseBlock(data)}
          </td>
        </tr>,
      );
    }

    return values;
  };

  renderColumn = (key, column, data) => {
    let content = null;

    if (typeof column.props.render === 'function') {
      content = column.props.render.call(null, data, column.props);
    } else if (typeof column.props.name === 'string') {
      content = data[column.props.name];
    }

    return <td className={column.props.className} key={key}>{content}</td>;
  };

  render() {
    const { tableClassName, headerClassName, locale, showNoResults, dataSource } = this.props;

    if (showNoResults) {
      return <NotFoundContent locale={locale} />;
    }

    if (!dataSource.length) {
      return null;
    }

    const grids = React.Children.toArray(this.props.children).filter(child => child.type === GridViewColumn);

    return (
      <div className="table-responsive">
        <table className={classNames('table data-grid-layout', tableClassName)}>
          <thead className={headerClassName}>
            {this.renderHead(this.recognizeHeaders(grids))}
          </thead>
          {this.renderBody(grids)}
        </table>
      </div>
    );
  }
}

export default CollapseGridView;
