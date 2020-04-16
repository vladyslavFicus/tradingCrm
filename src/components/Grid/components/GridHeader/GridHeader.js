import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withGridContext } from '../GridProvider';
import GridHeaderCell from '../GridHeaderCell';
import './GridHeader.scss';

class GridHeader extends PureComponent {
  static propTypes = {
    gridColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleSort: PropTypes.func.isRequired,
  };

  state = {
    sortList: {},
  };

  handleSortBy = async (sortBy) => {
    if (!sortBy) return;

    const { handleSort } = this.props;
    const { sortList } = this.state;
    const newSortList = { ...sortList };

    // Sorting steps 'ASC' => 'DESC' => without sorting
    // where 'ASC' - sorting from A-Z
    // 'DESC' - sorting from Z-A
    switch (sortList[sortBy]) {
      case 'ASC': {
        newSortList[sortBy] = 'DESC';
        break;
      }
      case 'DESC': {
        delete newSortList[sortBy];
        break;
      }
      default: {
        newSortList[sortBy] = 'ASC';
        break;
      }
    }

    this.setState({ sortList: { ...newSortList } }, () => handleSort(this.state.sortList));
  };

  render() {
    const {
      gridColumns,
    } = this.props;

    const { sortList } = this.state;

    return (
      <thead className="GridHeader">
        <tr>
          {gridColumns.map(({ props: { header, sortBy } }, index) => (
            <GridHeaderCell
              key={index}
              header={header}
              onHandleSort={() => this.handleSortBy(sortBy)}
              sortingName={sortBy}
              sortingDirection={sortList[sortBy]}
              columnIndex={index}
            />
          ))}
        </tr>
      </thead>
    );
  }
}

export default withGridContext(GridHeader);
