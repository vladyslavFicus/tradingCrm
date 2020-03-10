import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import GridLoader from '../GridLoader';
import GridRow from '../GridRow';

class GridBody extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    gridColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLastPage: PropTypes.bool.isRequired,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    allRowsSelected: PropTypes.bool.isRequired,
    rowsClassNames: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    handleRowClick: PropTypes.func.isRequired,
    handleSelectRow: PropTypes.func.isRequired,
    handlePageChanged: PropTypes.func.isRequired,
    withRowsHover: PropTypes.bool.isRequired,
    withMultiSelect: PropTypes.bool.isRequired,
    withLazyLoad: PropTypes.bool.isRequired,
  };

  handlePageChanged = () => {
    const { handlePageChanged, isLastPage, isLoading } = this.props;

    if (!isLastPage && !isLoading) {
      handlePageChanged();
    }
  };

  renderRow = (key, gridRowData) => {
    const {
      gridColumns,
      touchedRowsIds,
      allRowsSelected,
      rowsClassNames,
      handleRowClick,
      handleSelectRow,
      withRowsHover,
      withMultiSelect,
    } = this.props;

    return (
      <GridRow
        key={`grid-row-${key}`}
        rowIndex={key}
        allRowsSelected={allRowsSelected}
        touchedRowsIds={touchedRowsIds}
        gridRowData={gridRowData}
        gridColumns={gridColumns}
        handleRowClick={handleRowClick}
        handleSelectRow={handleSelectRow}
        rowsClassNames={rowsClassNames}
        withMultiSelect={withMultiSelect}
        withRowsHover={withRowsHover}
      />
    );
  };

  render() {
    const {
      data,
      isLoading,
      isLastPage,
      withLazyLoad,
    } = this.props;

    const gridRows = data.map((gridRowData, key) => this.renderRow(key, gridRowData));

    if (isLoading) {
      return (
        <tbody>
          <GridLoader />
        </tbody>
      );
    }

    if (withLazyLoad) {
      return (
        <InfiniteScroll
          element="tbody"
          hasMore={!isLastPage}
          loader={<GridLoader key="grid-loader" />}
          loadMore={this.handlePageChanged}
        >
          {gridRows}
        </InfiniteScroll>
      );
    }

    return <tbody>{gridRows}</tbody>;
  }
}

export default GridBody;
