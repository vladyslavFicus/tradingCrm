import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormikHelpers, FormikValues } from 'formik';
import { Utils } from '@crm/common';
import { decodeNullValues } from 'components/Formik/utils';
import { State } from 'types';
import { filterLabels } from 'constants/user';

import { RulesQueryVariables } from '../graphql/__generated__/RulesQuery';

const validate = Utils.createValidator({
  searchBy: 'string',
  country: ['string', `in:${['UNDEFINED', ...Object.keys(Utils.countryList)].join()}`],
  language: 'string',
  operators: 'string',
  partners: 'string',
}, Utils.translateLabels(filterLabels), false);

const useRulesGridFilter = () => {
  const state = useLocation().state as State<RulesQueryVariables>;
  const navigate = useNavigate();

  const initialValues = state?.filters || {};

  const handleReset = useCallback((resetForm: Function) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  }, [state]);

  const handleSubmit = useCallback((values: FormikValues, { setSubmitting }: FormikHelpers<FormikValues>) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });

    setSubmitting(false);
  }, [state]);

  return {
    initialValues,
    handleReset,
    handleSubmit,
    validate,
  };
};

export default useRulesGridFilter;
