import { Sort } from './sort';

export interface Page {
  from: number,
  size: number,
  sorts?: [] | undefined | Sort[],
}
