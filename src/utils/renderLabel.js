export default (entityValue, labels) => (
  entityValue && labels[entityValue]
    ? labels[entityValue]
    : entityValue
);
