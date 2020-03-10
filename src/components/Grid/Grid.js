import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shallowEqual from 'utils/shallowEqual';
import NotFoundContent from 'components/NotFoundContent';
import GridColumn from './components/GridColumn';
import GridHeader from './components/GridHeader';
import GridBody from './components/GridBody';
import './Grid.scss';

class Grid extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.bool,
    isLastPage: PropTypes.bool,
    className: PropTypes.string,
    rowsClassNames: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleSort: PropTypes.func,
    handleRowClick: PropTypes.func,
    handleSelectRow: PropTypes.func,
    handlePageChanged: PropTypes.func,
    handleAllRowsSelect: PropTypes.func,
    allRowsSelected: PropTypes.bool,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number),
    withLazyLoad: PropTypes.bool,
    withRowsHover: PropTypes.bool,
    withNoResults: PropTypes.bool,
    withMultiSelect: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    rowsClassNames: '',
    allRowsSelected: false,
    touchedRowsIds: [],
    isLoading: false,
    isLastPage: true,
    withLazyLoad: true,
    withRowsHover: false,
    withNoResults: false,
    withMultiSelect: false,
    handleSort: () => {},
    handleRowClick: () => {},
    handleSelectRow: () => {},
    handlePageChanged: () => {},
    handleAllRowsSelect: () => {},
  };

  shouldComponentUpdate(nextProps) {
    if (!nextProps.withLazyLoad) {
      return true;
    }

    return !shallowEqual(nextProps.data, this.props.data)
      || nextProps.withNoResults !== this.props.withNoResults
      || nextProps.touchedRowsIds.length !== this.props.touchedRowsIds.length
      || nextProps.allRowsSelected !== this.props.allRowsSelected
      || nextProps.isLoading !== this.props.isLoading
      || nextProps.isLastPage !== this.props.isLastPage;
  }

  render() {
    const {
      data,
      children,
      className,
      isLoading,
      isLastPage,
      touchedRowsIds,
      allRowsSelected,
      rowsClassNames,
      handleSort,
      handleRowClick,
      handleSelectRow,
      handlePageChanged,
      handleAllRowsSelect,
      withLazyLoad,
      withNoResults,
      withRowsHover,
      withMultiSelect,
    } = this.props;

    if (!isLoading && !data.length) {
      return (
        <If condition={withNoResults}>
          <NotFoundContent />
        </If>
      );
    }

    const gridColumns = React.Children
      .toArray(children)
      .filter(child => child.type === GridColumn && !child.props.isHidden);

    return (
      <table className={classNames('Grid', className)}>
        <GridHeader
          gridColumns={gridColumns}
          touchedRowsIds={touchedRowsIds}
          allRowsSelected={allRowsSelected}
          withMultiSelect={withMultiSelect}
          handleSort={handleSort}
          handleAllRowsSelect={handleAllRowsSelect}
        />

        <GridBody
          data={data}
          gridColumns={gridColumns}
          isLoading={isLoading}
          isLastPage={isLastPage}
          withLazyLoad={withLazyLoad}
          touchedRowsIds={touchedRowsIds}
          allRowsSelected={allRowsSelected}
          rowsClassNames={rowsClassNames}
          handleRowClick={handleRowClick}
          handleSelectRow={handleSelectRow}
          handlePageChanged={handlePageChanged}
          withRowsHover={withRowsHover}
          withMultiSelect={withMultiSelect}
        />
      </table>
    );
  }
}

export default Grid;
