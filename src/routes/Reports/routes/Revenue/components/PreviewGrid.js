import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import { types } from 'constants/revenue-report';

class PreviewGrid extends Component {
  render() {
    const { reportType } = this.props;

    if (!reportType) return null;

    return reportType === types.COUNTRY
      ? this.renderCountryGrid()
      : this.renderPlayerGrid();
  }

  renderEuColumn(data, column) {
    return <input type="checkbox" readOnly disabled defaultValue={data[column.name]}/>;
  }

  renderCountryGrid() {
    const {
      content,
      totalsRow,
      number,
      filters,
      totalPages,
      onFiltersChanged,
      onPageChanged,
    } = this.props;

    return <GridView
      dataSource={content}
      summaryRow={totalsRow[0]}
      onFiltersChanged={onFiltersChanged}
      onPageChange={onPageChanged}
      activePage={number + 1}
      totalPages={totalPages}
      defaultFilters={filters}
    >
      <GridColumn
        name="COUNTRY"
        header="COUNTRY"
        headerStyle={{ width: '10%' }}
        render={(data, column) => <small>{data[column.name]}</small>}
      />
      <GridColumn
        name="EU"
        header="EU"
        render={this.renderEuColumn}
      />
      <GridColumn
        name="HOLD_BONUS_TOTAL"
        header="HOLD_BONUS_TOTAL"
        headerStyle={{ width: '10%' }}
      />
      <GridColumn
        name="HOLD_RM_TOTAL"
        header="HOLD_RM_TOTAL"
        headerStyle={{ width: '10%' }}
      />
      <GridColumn
        name="STAKELOGIC_HOLD_BONUS_TOTAL"
        header="STAKELOGIC_HOLD_BONUS_TOTAL"
        headerStyle={{ width: '10%' }}
      />
      <GridColumn
        name="STAKELOGIC_RM_TOTAL"
        header="STAKELOGIC_RM_TOTAL"
        headerStyle={{ width: '10%' }}
      />
      <GridColumn
        name="TOTAL_BMC"
        header="TOTAL_BMC"
        headerStyle={{ width: '10%' }}
      />
      <GridColumn
        name="UNKNOWN_HOLD_BONUS_TOTAL"
        header="UNKNOWN_HOLD_BONUS_TOTAL"
        headerStyle={{ width: '10%' }}
      />
      <GridColumn
        name="UNKNOWN_RM_TOTAL"
        header="UNKNOWN_RM_TOTAL"
        headerStyle={{ width: '10%' }}
      />
    </GridView>;
  }

  renderPlayerGrid() {
    const {
      content,
      totalsRow,
      number,
      filters,
      totalPages,
      onFiltersChanged,
      onPageChanged,
    } = this.props;

    return <GridView
      dataSource={content}
      summaryRow={totalsRow[0]}
      onFiltersChanged={onFiltersChanged}
      onPageChange={onPageChanged}
      activePage={number + 1}
      totalPages={totalPages}
      defaultFilters={filters}
    >
      <GridColumn
        name="PLAYER_UUID"
        header="PLAYER_UUID"
        headerStyle={{ width: '10%' }}
      />
      <GridColumn
        name="COUNTRY"
        header="COUNTRY"
        headerStyle={{ width: '10%' }}
        render={(data, column) => <small>{data[column.name]}</small>}
      />
      <GridColumn
        name="EU"
        header="EU"
        render={this.renderEuColumn}
      />
      <GridColumn
        name="HOLD_BONUS_TOTAL"
        header="HOLD_BONUS_TOTAL"
        headerStyle={{ width: '10%' }}
      />
      <GridColumn
        name="HOLD_RM_TOTAL"
        header="HOLD_RM_TOTAL"
        headerStyle={{ width: '10%' }}
      />
      <GridColumn
        name="STAKELOGIC_HOLD_BONUS_TOTAL"
        header="STAKELOGIC_HOLD_BONUS_TOTAL"
        headerStyle={{ width: '10%' }}
      />
      <GridColumn
        name="STAKELOGIC_RM_TOTAL"
        header="STAKELOGIC_RM_TOTAL"
        headerStyle={{ width: '10%' }}
      />
      <GridColumn
        name="TOTAL_BMC"
        header="TOTAL_BMC"
        headerStyle={{ width: '10%' }}
      />
      <GridColumn
        name="UNKNOWN_HOLD_BONUS_TOTAL"
        header="UNKNOWN_HOLD_BONUS_TOTAL"
        headerStyle={{ width: '10%' }}
      />
      <GridColumn
        name="UNKNOWN_RM_TOTAL"
        header="UNKNOWN_RM_TOTAL"
        headerStyle={{ width: '10%' }}
      />
    </GridView>;
  }
}

PreviewGrid.propTypes = {};

export default PreviewGrid;
