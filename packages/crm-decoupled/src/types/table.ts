export type TableSelection = {
  all: boolean,
  touched: number[],
  max: number,
  selected: number,
  reset: () => void,
}

export type Select = TableSelection | null;
