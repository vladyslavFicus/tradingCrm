const getOperatorSpreadsPercentageErorr = (operatorSpreads) => {
  if (operatorSpreads?.length && operatorSpreads.reduce((a, b) => a + (b.percentage || 0), 0) !== 100) {
    return 'INVALID_PERCENTAGE';
  }

  return null;
};

export const extraValidation = ({ operatorSpreads }, errors, { withOperatorSpreads }) => {
  const operatorSpreadsPercentageError = withOperatorSpreads
    && getOperatorSpreadsPercentageErorr(operatorSpreads);

  return {
    ...errors,
    ...operatorSpreadsPercentageError && { operatorSpreads: operatorSpreadsPercentageError },
  };
};
