import { Authority } from '__generated__/types';

export type Auth = {
  department: string,
  role: string,
  uuid: string,
};

export type Brand = {
  id: string,
  authorities: Array<Authority>,
};
