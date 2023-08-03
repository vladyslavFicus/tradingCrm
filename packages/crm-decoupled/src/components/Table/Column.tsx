import React from 'react';

export type Props = {
  sortBy?: string | boolean, // Item key to make it column sortable by
  width?: number, // Width of column in px
  header?: string, // Column label
  name?: string, // Required when used inside AdjustableTable component to identify each column
  render: (props: any) => React.ReactNode, // Custom component to render column
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Column = (props: Props) => null;

export default Column;
