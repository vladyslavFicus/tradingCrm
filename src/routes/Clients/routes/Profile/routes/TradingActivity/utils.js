export const getTypeColor = value => (
  value === 'OP_BALANCE' || value.includes('BUY')
    ? 'color-success'
    : 'color-danger'
);
