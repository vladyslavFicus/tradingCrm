const renderLabel = (entityValue, labels) => {
  return entityValue && labels[entityValue]
    ? labels[entityValue]
    : entityValue;
};

export {
  renderLabel,
};
