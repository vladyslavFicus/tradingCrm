import { ClientCallback, LeadCallback } from '__generated__/types';

export type LabelValue = {
  label: string,
  value: string,
};

export type CommonCallback = ClientCallback | LeadCallback;
