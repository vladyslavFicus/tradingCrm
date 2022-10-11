import I18n from 'i18n-js';
import React, { useMemo, useState, isValidElement, Children, ReactElement } from 'react';
import compose from 'compose-function';
import { sortBy, indexOf } from 'lodash';
import { QueryResult } from '@apollo/client';
import { withRequests } from 'apollo';
import { Column, Table } from '..';
import { Props as ColumnPropTypes } from '../Column';
import GridConfigQuery from './graphql/GridConfigQuery';
import GridConfig from './GridConfig';
import { QueryResultType } from './types';
import './AdjustableTable.scss';

type ColumnComponents = Array<ReactElement<ColumnPropTypes>>;

const sortByName = (items: any[], order: string[]) => {
  if (!order?.length) {
    return items;
  }

  // validate ordering
  const validatedOrder = order.filter(i => items.indexOf(i) > -1);

  return Array.from(new Set([...validatedOrder, ...items]));
};


const getColumns = (children: React.ReactNode) => useMemo(
  () => Children.toArray(children).filter(child => isValidElement(child) && child.type === Column) as ColumnComponents,
  [children],
);

const sortColumns = (
  columns: ColumnComponents,
  order: string[],
) => useMemo(
  () => sortBy(columns, column => indexOf(order, column.props.name as string)),
  [columns, order],
);

interface Props {
  type: string,
  defaultColumns: [string],
  columnsOrder: [string],
  children: React.ReactNode
  gridConfigQuery: QueryResult<QueryResultType>,
}

/*  Add to Table component ability to show/hide columns and save setting
*
*  @props   {string}     type             Table configuration type(name): CLIENT / PAYMENT / LEAD
*  @props   {[string]}   defaultColumns   List of columns name which will be visible if when user configuration absent
*  @props   {GQL query}  gridConfigQuery  Query to request columns configuration from GQL server
*
*  this component required non-empty "name" property of the Columns inside.
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
*  This component get list children, then filter columns by name. and build Table with all
*  columns name present in defaultColumns or columns list received from BE
*/

const AdjustableTable = (props: Props) => {
  const {
    type,
    defaultColumns,
    children,
    gridConfigQuery,
    columnsOrder,
    ...restProps
  } = props;

  const allAvailableColumns = getColumns(children).map(column => column.props.name);

  const gridConfig = type ? gridConfigQuery.data?.gridConfig || {} : undefined;
  const [selectedColumns, updateColumns] = useState();

  const columns = selectedColumns || (!type && gridConfig?.columns) || defaultColumns || allAvailableColumns;
  const isColumnEnabled = (name: string) => !name || columns.map((item: string) => item).includes(name);
  const allColumns = sortColumns(getColumns(children), sortByName(columns, columnsOrder));
  const visibleColumns = allColumns.filter(({ props: { name } }: any) => isColumnEnabled(name));
  const columnsWithTitle = allColumns.map(({ props: { name, header } }: any) => ({ name, header }));
  const isMoreThanOneColumnVisible = visibleColumns.length > 0;

  return (
    <React.Fragment>
      <If condition={!!type}>
        <GridConfig
          gridConfig={{ uuid: gridConfig?.uuid, type }}
          columnsSet={columns}
          onUpdate={updateColumns}
          availableColumnsSet={columnsWithTitle}
        />
      </If>
      <Choose>
        <When condition={isMoreThanOneColumnVisible}>
          <Table {...restProps}>
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
