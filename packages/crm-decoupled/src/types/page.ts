import { Sort } from 'types';

export interface Page {
  from: number,
  size: number,
  sorts?: [] | undefined | Sort[],
}
