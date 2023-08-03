export default (entityValue: string, labels: Record<string, string>) => (
  entityValue && labels[entityValue]
    ? labels[entityValue]
    : entityValue
);
