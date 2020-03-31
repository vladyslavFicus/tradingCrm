import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withGridContext } from '../GridProvider';
import GridRowCell from '../GridRowCell';
import './GridRow.scss';

class GridRow extends PureComponent {
  static propTypes = {
    gridData: PropTypes.arrayOf(PropTypes.object).isRequired,
    gridRowData: PropTypes.object,
    gridColumns: PropTypes.arrayOf(PropTypes.object),
    rowsClassNames: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
      .isRequired,
    rowIndex: PropTypes.number.isRequired,
    handleRowClick: PropTypes.func.isRequired,
    handleSelectRow: PropTypes.func.isRequired,
    allRowsSelected: PropTypes.bool.isRequired,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    withMultiSelect: PropTypes.bool.isRequired,
    withRowsHover: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    gridRowData: {},
    gridColumns: [],
  };

  handleCheckboxChange = () => {
    const {
      gridData,
      handleSelectRow,
      allRowsSelected,
      touchedRowsIds,
      rowIndex,
    } = this.props;

    const touchedRows = [...touchedRowsIds];
    const index = touchedRows.findIndex(item => item === rowIndex);

    if (index === -1) {
      touchedRows.push(rowIndex);
    } else {
      touchedRows.splice(index, 1);
    }

    const selectedAll = gridData.length === touchedRows.length;

    handleSelectRow(
      allRowsSelected || selectedAll,
      selectedAll && !allRowsSelected ? [] : touchedRows,
    );
  };

  checkIsRowSelected = (rowId) => {
    const { allRowsSelected, touchedRowsIds } = this.props;

    if (!touchedRowsIds.length) {
      return allRowsSelected;
    }

    return allRowsSelected
      ? !touchedRowsIds.includes(rowId)
      : touchedRowsIds.includes(rowId);
  };

  render() {
    const {
      rowIndex,
      gridColumns,
      gridRowData,
      handleRowClick,
      rowsClassNames,
      withMultiSelect,
      withRowsHover,
    } = this.props;

    const isSelected = this.checkIsRowSelected(rowIndex);
    const rowClassName = typeof rowsClassNames === 'function'
      ? rowsClassNames(gridRowData)
      : rowsClassNames;

    return (
      <tr
        key={rowIndex}
        onClick={() => handleRowClick(gridRowData)}
        className={classNames(
          'GridRow',
          {
            'GridRow--with-hover': withRowsHover,
            'GridRow--is-selected': isSelected,
          },
          rowClassName,
        )}
      >
        {gridColumns.map((columnData, index) => (
          <GridRowCell
            key={index}
            columnData={columnData}
            gridRowData={gridRowData}
            isCheckboxActive={isSelected}
            handleCheckboxChange={this.handleCheckboxChange}
            withCheckbox={withMultiSelect && index === 0}
          />
        ))}
      </tr>
    );
  }
}

export default withGridContext(GridRow);
