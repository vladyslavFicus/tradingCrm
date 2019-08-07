import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import classNames from 'classnames';
import GridViewColumn from './GridViewColumn';
import shallowEqual from '../../utils/shallowEqual';

const SortableItem = SortableElement(({ data, index, columns }) => (
  <tr>
    {
      columns.map((column, columnKey) => {
        let content = null;

        if (typeof column.props.render === 'function') {
          content = column.props.render.call(null, data, column.props);
        } else if (typeof column.props.name === 'string') {
          content = data[column.props.name];
        }

        return (
          <td className={column.props.className} key={[`${index}-${columnKey}`]}>{content}</td>
        );
      })
    }
  </tr>
));

const SortableList = SortableContainer(({ items, columns }) => (
  <tbody>
    {items.map((value, index) => (
      <SortableItem key={[`item-${index}`]} index={index} data={value} columns={columns} />
    ))}
  </tbody>
));

class SortableGridView extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    tableClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    onFiltersChanged: PropTypes.func,
    onSortEnd: PropTypes.func,
    defaultFilters: PropTypes.object,
    dataSource: PropTypes.array.isRequired,
  };

  static defaultProps = {
    tableClassName: null,
    headerClassName: 'text-uppercase',
    defaultFilters: {},
    onFiltersChanged: null,
    onSortEnd: null,
  };

  state = {
    filters: this.props.defaultFilters || {},
  };

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.dataSource, this.props.dataSource)) {
      this.setState({
        dataSource: nextProps.dataSource,
      });
    }
  }

  onFiltersChanged() {
    this.props.onFiltersChanged(this.state.filters);
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ dataSource }) => ({
      dataSource: arrayMove(dataSource, oldIndex, newIndex),
    }), () => this.props.onSortEnd({ from: oldIndex + 1, to: newIndex + 1 }));
  };

  recognizeHeaders = grids => (
    grids.map(({ props }) => {
      const config = { children: props.header };

      if (props.headerClassName) {
        config.className = props.headerClassName;
      }

      if (props.headerStyle) {
        config.style = props.headerStyle;
      }

      return config;
    })
  );

  renderHead = columns => <tr>{columns.map((item, key) => <th key={key} {...item} />)}</tr>;

  render() {
    const {
      tableClassName,
      headerClassName,
    } = this.props;

    const { dataSource } = this.state;

    const columns = React.Children.toArray(this.props.children).filter(child => child.type === GridViewColumn);

    return (
      <table className={classNames('table data-grid-layout', tableClassName)}>
        <thead className={headerClassName}>
          {this.renderHead(this.recognizeHeaders(columns))}
        </thead>
        {
          dataSource
          && (
            <SortableList
              useDragHandle
              columns={columns}
              items={dataSource}
              onSortEnd={this.onSortEnd}
              helperClass="drag-content"
            />
          )
        }
      </table>
    );
  }
}

export default SortableGridView;
