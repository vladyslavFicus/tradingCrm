import I18n from 'i18n-js';
import React, { useMemo, useState } from 'react';
import compose from 'compose-function';
import { QueryResult } from '@apollo/client';
import { withRequests } from 'apollo';
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
  defaultColumns: [string],
  children: React.ReactNode
  gridConfigQuery: QueryResult<QueryResultType>,
}

/*  Add to Table component abbility to show/hide columns and save setting
*
*  @props   {string}     type             Table configuration type(name): CLIENT / PAYMENT / LEAD
*  @props   {[string]}   defaultColumns   List of columns name which will be visible if when user configuration absent
*  @props   {GQL query}  gridConfigQuery  Query to request columns configuration from GQL server
*
*  this component requred non-empty "name" propperty of the Columns inside.
*  <AdjustableTable props>
*    <Column
*      name="name1"
*      header="column1"
*      render={renderFunc1}
*    />
*    <Column
*      name="name2"
*      header="column2"
*      render={renderFunc2}
*    />
*  </ AdjustableTable>
*
*  Columns name in the props and the defaultColumns should be the same (case sensitive !!!)
*
*  This component get list children, then filter columns by name. and build Tebla with all
*  columns name present in defaultColumns or columns list received from BE
*/

const AdjustableTable = ({ type, defaultColumns, children, gridConfigQuery, ...props }: Props) => {
  const gridConfig = gridConfigQuery.data?.gridConfig || {};
  const [selectedColumns, updateColumns] = useState();
  const columns = selectedColumns || gridConfig?.columns || defaultColumns;
  const isColumnEnabled = (name: string) => !name || columns.map((item: string) => item).includes(name);
  const allColumns = getColumns(children);
  const visibleColumns = allColumns.filter(({ props: { name } }: any) => isColumnEnabled(name));
  const columnsWithTitle = allColumns.map(({ props: { name, header } }: any) => ({ name, header }));
  const isMoreThanOneColumnVisible = visibleColumns.length > 0;

  return (
    <React.Fragment>
      <GridConfig
        gridConfig={{ uuid: gridConfig?.uuid, type }}
        columnsSet={columns}
        onUpdate={updateColumns}
        availableColumnsSet={columnsWithTitle}
      />
      <Choose>
        <When condition={isMoreThanOneColumnVisible}>
          <Table {...props}>
            {visibleColumns}
          </Table>
        </When>
        <Otherwise>
          <div className="AdjustableTable__no_columns">{I18n.t('GRID_CONFIG.NO_SELECTED_COLUMN_MESSAGE')}</div>
        </Otherwise>
      </Choose>
    </React.Fragment>
  );
};

export default compose(
  withRequests({
    gridConfigQuery: GridConfigQuery,
  }),
)(AdjustableTable);
