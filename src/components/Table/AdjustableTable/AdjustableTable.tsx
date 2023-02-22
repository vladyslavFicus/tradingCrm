import I18n from 'i18n-js';
import React, { useMemo, useState, isValidElement, Children, ReactElement } from 'react';
import { sortBy, compact } from 'lodash';
import { Sort__Input as Sort, GridConfig__Types__Enum as GridConfigTypes } from '__generated__/types';
import { TableSelection } from 'types';
import { Column, Table } from '..';
import { Props as ColumnPropTypes } from '../Column';
import GridConfig from './GridConfig';
import { AvailableColumns } from './types';
import { useGridConfigQuery } from './graphql/__generated__/GridConfigQuery';
import './AdjustableTable.scss';

type ColumnComponents = Array<ReactElement<ColumnPropTypes>>;

const getColumns = (children: React.ReactNode) => useMemo(
  () => Children.toArray(children).filter(child => isValidElement(child) && child.type === Column) as ColumnComponents,
  [children],
);

/**
 * Get sorted columns depends on sorting config if it exists
 *
 * @param columns
 * @param columnsOrder
 */
const getSortedColumns = (columns: ColumnComponents, columnsOrder: string[]) => {
  if (!columnsOrder?.length) {
    return columns;
  }

  return sortBy(columns, (column) => {
    const columnIndex = columnsOrder.indexOf(column.props.name as string);

    // If column was not found in columnsOrder array -> put column to the end of array.
    // If column was found in columnsOrder array -> put on that index, that determined in columnsOrder array.
    return columnIndex === -1 ? columns.length : columnIndex;
  });
};

type Props = {
  type?: GridConfigTypes,
  totalCount?: number,
  withMultiSelect?: boolean,
  maxSelectCount?: number,
  items: Array<Object>,
  sorts: Array<Sort>,
  loading: boolean,
  hasMore: boolean,
  defaultColumns?: Array<string>,
  columnsOrder: Array<string>,
  children: React.ReactNode,
  stickyFromTop: string | number,
  onMore: () => void,
  onSort: (sorts: Array<Sort>) => void,
  onSelect?: () => void,
  onSelectError?: (select: TableSelection) => void,
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
    columnsOrder,
    ...restProps
  } = props;

  const [selectedColumns, setSelectedColumns] = useState<Array<string> | null>(null);

  // ===== Requests ===== //
  const gridConfigQuery = useGridConfigQuery({ skip: !type, variables: { type: type as GridConfigTypes } });

  const gridConfig = gridConfigQuery.data?.gridConfig;

  const getColumnsWithTitle = (items: ColumnComponents): AvailableColumns => {
    const result: AvailableColumns = [];

    items.forEach(({ props: { name, header } }) => {
      if (name && header) {
        result.push({ name, header });
      }
    });
    return result;
  };

  const allAvailableColumns = compact(getColumns(children).map(column => column.props.name));
  const columns = selectedColumns || gridConfig?.columns || defaultColumns || allAvailableColumns;
  const isColumnEnabled = (name: string) => !name || columns.includes(name);
  const allColumns = getSortedColumns(getColumns(children), columnsOrder);
  const visibleColumns = allColumns.filter(item => item.props?.name && isColumnEnabled(item.props?.name));
  const columnsWithTitle = getColumnsWithTitle(allColumns);

  const renderGridConfig = () => {
    if (!type) {
      return null;
    }

    return (
      <GridConfig
        gridConfig={{ uuid: gridConfig?.uuid, type }}
        columnsSet={columns}
        onUpdate={setSelectedColumns}
        availableColumnsSet={columnsWithTitle}
      />
    );
  };

  return (
    <>
      {renderGridConfig()}

      <Choose>
        <When condition={visibleColumns.length > 0}>
          <Table {...restProps}>
            {visibleColumns}
          </Table>
        </When>

        <Otherwise>
          <div className="AdjustableTable__no_columns">{I18n.t('GRID_CONFIG.NO_SELECTED_COLUMN_MESSAGE')}</div>
        </Otherwise>
      </Choose>
    </>
  );
};

export default React.memo(AdjustableTable);
