import { useCallback } from 'react';
import { FormikErrors, FormikValues } from 'formik';
import { Types } from '@crm/common';
import { RuleOperatorSpread__Input as RuleOperatorSpread } from '__generated__/types';

export type FormikBag = {
  isSubmitting: boolean,
  errors: FormikErrors<FormikValues>,
  setFieldValue: Types.SetFieldValue<FormikValues>,
};

type Props = {
  operatorSpreads: Array<RuleOperatorSpread>,
  formikBag: FormikBag,
};

const useRuleSettings = (props: Props) => {
  const {
    operatorSpreads,
    formikBag: {
      setFieldValue,
    },
  } = props;

  const removeOperatorSpread = useCallback((index: number) => {
    const newOperatorSpreads = [...operatorSpreads];

    newOperatorSpreads.splice(index, 1);
    setFieldValue('operatorSpreads', newOperatorSpreads);
  }, [operatorSpreads]);

  return {
    removeOperatorSpread,
  };
};

export default useRuleSettings;
