export type GridConfigType = {
  uuid?: string,
  type?: string,
  columns?: [string],
}

export type QueryResultType = { gridConfig: GridConfigType };
