export enum entities {
  OPERATOR = 'OPERATOR',
  PROFILE = 'PROFILE',
  PAYMENT = 'PAYMENT',
}

export const entitiesPrefixes: Record<entities, string> = {
  [entities.OPERATOR]: 'OP',
  [entities.PROFILE]: 'PL',
  [entities.PAYMENT]: 'TA',
};
