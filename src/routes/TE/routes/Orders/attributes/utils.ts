export const getTypeColor = (value: string | undefined) => (
  value?.includes('BUY')
    ? 'color-success'
    : 'color-danger'
);
