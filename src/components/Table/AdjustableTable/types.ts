import { GridConfig__Types__Enum as GridConfigTypes } from '__generated__/types';

export type Config = {
  type: GridConfigTypes,
  uuid?: string,
};

type AvailableColumn = {
  name: string,
  header: string,
};

export type AvailableColumns = Array<AvailableColumn>;
