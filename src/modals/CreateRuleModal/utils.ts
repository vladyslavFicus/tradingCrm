import { Error, RuleOperatorSpread__Input as RuleOperatorSpread } from '__generated__/types';
import { FormValues } from './CreateRuleModal';

type WithOperatorSpreads = {
      withOperatorSpreads?: boolean,
};

const getOperatorSpreadsPercentageError = (operatorSpreads: Array<RuleOperatorSpread>) => {
  if (operatorSpreads?.length && operatorSpreads.reduce((a, b) => a + (b.percentage || 0), 0) !== 100) {
    return 'INVALID_PERCENTAGE';
  }

  return null;
};

export const extraValidation = (
  { operatorSpreads }: FormValues,
  errors: Error,
  { withOperatorSpreads }: WithOperatorSpreads,
) => {
  const operatorSpreadsPercentageError = withOperatorSpreads
    && getOperatorSpreadsPercentageError(operatorSpreads);

  return {
    ...errors,
    ...operatorSpreadsPercentageError && { operatorSpreads: operatorSpreadsPercentageError },
  };
};
