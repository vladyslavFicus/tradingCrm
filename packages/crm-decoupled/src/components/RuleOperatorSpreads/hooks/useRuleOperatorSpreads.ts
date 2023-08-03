import I18n from 'i18n-js';
import { RuleOperatorSpread__Input as RuleOperatorSpread } from '__generated__/types';
import { validationErrors } from '../constants';

type Props = {
  operatorSpreads: Array<RuleOperatorSpread>,
  validationError?: string,
};

const useRuleOperatorSpreads = (props: Props) => {
  const {
    operatorSpreads,
    validationError,
  } = props;

  const selectedOperators = operatorSpreads.map(({ parentUser }) => parentUser);
  const error = validationError && validationErrors[validationError] && I18n.t(validationErrors[validationError]);

  return {
    selectedOperators,
    error,
  };
};

export default useRuleOperatorSpreads;
