import { withRequests } from 'apollo';
import I18n from 'i18n-js';
import React, { useMemo, useState } from 'react';
import { compose, QueryResult } from 'react-apollo';
import { Column, Table } from '..';
import GridConfigQuery from './graphql/GridConfigQuery';
import GridConfig from './GridConfig';
import { QueryResultType } from './types';
import './AdjustableTable.scss';

const getColumns = (children: React.ReactNode) => useMemo(
  () => React.Children.toArray(children).filter(child => React.isValidElement(child) && child.type === Column),
  [children],
);

interface Props {
  type: string,
  defaultColumnsSet: [string],
  children: React.ReactNode
  gridConfigQuery: QueryResult<QueryResultType>,
}

const AdjustableTable = ({ type, defaultColumnsSet, children, gridConfigQuery, ...props }: Props) => {
  const gridConfig = gridConfigQuery.data?.gridConfig || {};
  const [selectedColumns, updateColumns] = useState();
  const columns = selectedColumns || gridConfig?.columns || defaultColumnsSet;

  const isColumnEnabled = (name: string) => !name || (name
    && columns.map((item: any) => item.toUpperCase()).includes(name.toUpperCase()));

  const allColumns = getColumns(children);
  const visibleColumns = allColumns.filter(({ props: { name } }: any) => isColumnEnabled(name));
  const columnsWithTitle = allColumns.map(({ props: { name, header } }: any) => ({ name, header }));
  const isMoreThanOneColumnVisible = visibleColumns.length > 0;

  return (
    <React.Fragment>
      <GridConfig
        gridConfig={{ uuid: gridConfig?.uuid, type }}
        сolumnsSet={columns}
        onUpdate={updateColumns}
        availableColumnsSet={columnsWithTitle}
      />
      <If condition={isMoreThanOneColumnVisible}>
        <Table {...props}>
          {visibleColumns}
        </Table>
      </If>
      <If condition={!isMoreThanOneColumnVisible}>
        <div className="AdjustableTable__no_columns">{I18n.t('GRID_CONFIG.NO_SELECTED_COLUMN_MESSAGE')}.</div>
      </If>
    </React.Fragment>
  );
};

export default compose(
  withRequests({
    gridConfigQuery: GridConfigQuery,
  }),
)(AdjustableTable);
