import { ClickToCall__CallSystem__Enum as CallSystem } from '__generated__/types';
import { Position } from 'types/position';

export type Arrow = Position & null | 'center';

export type ProviderOptionsType = {
  prefix?: string | null,
};

type Prefix = {
  label: string,
  prefix: string,
};

export type Config = {
  callSystem: CallSystem,
  prefixes: Array<Prefix>,
};
