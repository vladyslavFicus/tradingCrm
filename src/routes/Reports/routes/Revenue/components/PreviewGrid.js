import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import { types } from '../../../../../constants/revenue-report';
import Amount from '../../../../../components/Amount';

class PreviewGrid extends Component {
  render() {
    const { reportType } = this.props;

    if (!reportType) return null;

    return reportType === types.COUNTRY
      ? this.renderCountryGrid()
      : this.renderPlayerGrid();
  }

  renderEuColumn = (data, column) => <input type="checkbox" readOnly disabled defaultValue={data[column.name]} />;

  renderAmountColumn = (data, column) => {
    const { currency } = this.props;

    return <Amount amount={data[column.name]} currency={currency} />;
  };

  renderSummaryRow = () => {
    const { totalsRow, currency } = this.props;

    if (totalsRow.length < 1) {
      return null;
    }

    return Object.keys(totalsRow[0]).reduce((res, item) => ({
      ...res,
      [item]: <Amount amount={totalsRow[0][item]} currency={currency} />,
    }), {});
  };

  renderCountryGrid() {
    const {
      content,
      number,
      filters,
      totalPages,
      onFiltersChanged,
      onPageChanged,
    } = this.props;

    return (
      <GridView
        dataSource={content}
        summaryRow={this.renderSummaryRow()}
        onFiltersChanged={onFiltersChanged}
        onPageChange={onPageChanged}
        activePage={number + 1}
        totalPages={totalPages}
        defaultFilters={filters}
      >
        <GridViewColumn
          name="Country"
          header="Country"
          headerStyle={{ width: '10%' }}
          render={(data, column) => <small>{data[column.name]}</small>}
        />
        <GridViewColumn
          name="EU"
          header="EU"
          render={this.renderEuColumn}
        />
        <GridViewColumn
          name="Hold_Bonus_Total"
          header="Hold Bonus Total"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
        <GridViewColumn
          name="Hold_RM_Total"
          header="Hold RM Total"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
        <GridViewColumn
          name="stakelogic_Hold_Bonus_Total"
          header="Stakelogic Hold Bonus Total"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
        <GridViewColumn
          name="stakelogic_RM_Total"
          header="Stakelogic RM Total"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
        <GridViewColumn
          name="Total_BMC"
          header="Total BMC"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
        <GridViewColumn
          name="unknown_Hold_Bonus_Total"
          header="Unknown Hold Bonus Total"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
        <GridViewColumn
          name="unknown_RM_Total"
          header="Unknown RM Total"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
      </GridView>
    );
  }

  renderPlayerGrid() {
    const {
      content,
      number,
      filters,
      totalPages,
      onFiltersChanged,
      onPageChanged,
    } = this.props;

    return (
      <GridView
        dataSource={content}
        summaryRow={this.renderSummaryRow()}
        onFiltersChanged={onFiltersChanged}
        onPageChange={onPageChanged}
        activePage={number + 1}
        totalPages={totalPages}
        defaultFilters={filters}
      >
        <GridViewColumn
          name="PLAYER_UUID"
          header="PLAYER_UUID"
          headerStyle={{ width: '10%' }}
        />
        <GridViewColumn
          name="Country"
          header="Country"
          headerStyle={{ width: '10%' }}
          render={(data, column) => <small>{data[column.name]}</small>}
        />
        <GridViewColumn
          name="EU"
          header="EU"
          render={this.renderEuColumn}
        />
        <GridViewColumn
          name="Hold_Bonus_Total"
          header="Hold Bonus Total"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
        <GridViewColumn
          name="Hold_RM_Total"
          header="Hold RM Total"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
        <GridViewColumn
          name="stakelogic_Hold_Bonus_Total"
          header="Stakelogic Hold Bonus Total"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
        <GridViewColumn
          name="stakelogic_RM_Total"
          header="Stakelogic RM Total"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
        <GridViewColumn
          name="Total_BMC"
          header="Total BMC"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
        <GridViewColumn
          name="unknown_Hold_Bonus_Total"
          header="Unknown Hold Bonus Total"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
        <GridViewColumn
          name="unknown_RM_Total"
          header="Unknown RM Total"
          headerStyle={{ width: '10%' }}
          render={this.renderAmountColumn}
        />
      </GridView>
    );
  }
}

PreviewGrid.propTypes = {
  currency: PropTypes.string.isRequired,
  content: PropTypes.array,
  onFiltersChanged: PropTypes.func,
  onPageChanged: PropTypes.func,
  reportType: PropTypes.string.isRequired,
  totalsRow: PropTypes.array,
  filters: PropTypes.object,
};

export default PreviewGrid;
