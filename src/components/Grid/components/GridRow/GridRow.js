import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import GridRowCell from '../GridRowCell';
import './GridRow.scss';

class GridRow extends PureComponent {
  static propTypes = {
    gridRowData: PropTypes.object,
    gridColumns: PropTypes.arrayOf(PropTypes.object),
    rowsClassNames: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
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
      handleSelectRow,
      allRowsSelected,
      touchedRowsIds,
      rowIndex,
    } = this.props;

    const touchedRows = [...touchedRowsIds];
    const index = touchedRows.findIndex(item => item === rowIndex);

    if (index === -1) {
      touchedRows.push(rowIndex);
      handleSelectRow(!allRowsSelected, rowIndex, touchedRows);
    } else {
      touchedRows.splice(index, 1);
      handleSelectRow(allRowsSelected, rowIndex, touchedRows);
    }
  };

  checkIsRowSelected = (rowId) => {
    const { allRowsSelected, touchedRowsIds } = this.props;

    if (!touchedRowsIds.length) {
      return allRowsSelected;
    }

    const isRowTouched = touchedRowsIds.findIndex(item => item === rowId);

    return allRowsSelected ? isRowTouched === -1 : isRowTouched !== -1;
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
    const rowClassName = typeof rowsClassNames === 'function' ? rowsClassNames(gridRowData) : rowsClassNames;

    return (
      <tr
        key={rowIndex}
        onClick={() => handleRowClick(gridRowData)}
        className={
          classNames(
            'GridRow',
            {
              'GridRow--with-hover': withRowsHover,
              'GridRow--is-selected': isSelected,
            },
            rowClassName,
          )
        }
      >
        {
          gridColumns.map((columnData, columnKey) => (
            <GridRowCell
              key={`grid-cell-${rowIndex}-${columnKey}`}
              columnData={columnData}
              gridRowData={gridRowData}
              isCheckboxActive={isSelected}
              handleCheckboxChange={this.handleCheckboxChange}
              withCheckbox={withMultiSelect && columnKey === 0}
            />
          ))
        }
      </tr>
    );
  }
}

export default GridRow;
