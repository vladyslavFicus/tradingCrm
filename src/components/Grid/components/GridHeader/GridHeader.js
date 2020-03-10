import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GridHeaderCell from '../GridHeaderCell';
import './GridHeader.scss';

class GridHeader extends PureComponent {
  static propTypes = {
    gridColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    allRowsSelected: PropTypes.bool.isRequired,
    withMultiSelect: PropTypes.bool.isRequired,
    handleSort: PropTypes.func.isRequired,
    handleAllRowsSelect: PropTypes.func.isRequired,
  };

  state = {
    sortList: {},
  };

  handleSortBy = async (sortBy) => {
    if (!sortBy) return;

    const { handleSort } = this.props;
    const { sortList } = this.state;
    const sortingData = {};

    // Sorting steps 'ASC' => 'DESC' => without sorting
    if (sortList[sortBy] === 'ASC') {
      sortingData[sortBy] = 'DESC';
    } else if (sortList[sortBy] === 'DESC') {
      sortingData[sortBy] = undefined;
    } else {
      sortingData[sortBy] = 'ASC';
    }

    this.setState({
      sortList: {
        ...sortList,
        ...sortingData,
      },
    }, () => handleSort(this.state.sortList));
  };

  render() {
    const {
      gridColumns,
      touchedRowsIds,
      allRowsSelected,
      withMultiSelect,
      handleAllRowsSelect,
    } = this.props;

    const { sortList } = this.state;

    return (
      <thead className="GridHeader">
        <tr>
          {gridColumns.map(({ props: { header, sortBy } }, key) => (
            <GridHeaderCell
              key={`${header}-${key}`}
              header={header}
              onHandleSort={() => this.handleSortBy(sortBy)}
              sortingName={sortBy}
              sortingDirection={sortList[sortBy]}
              columnIndex={key}
              touchedRowsIds={touchedRowsIds}
              allRowsSelected={allRowsSelected}
              withMultiSelect={withMultiSelect}
              handleAllRowsSelect={handleAllRowsSelect}
            />
          ))}
        </tr>
      </thead>
    );
  }
}

export default GridHeader;
