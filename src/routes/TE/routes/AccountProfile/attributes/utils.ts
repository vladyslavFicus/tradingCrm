export const getTypeColor = (value: string) => (
  value?.includes('BUY')
    ? 'color-success'
    : 'color-danger'
);
