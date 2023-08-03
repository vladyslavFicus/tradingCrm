export type Detail = {
  from?: string,
  to?: string,
  elements?: Array<Detail>,
  value?: string | Detail,
  changeType?: 'ADDED' | 'CHANGED' | 'REMOVED',
};

export type Details = {
  [key: string]: Detail,
};
