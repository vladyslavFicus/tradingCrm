import { useCallback } from 'react';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { FormikHelpers } from 'formik';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import { decodeNullValues } from 'components/Formik/utils';

type UseFilter<TFormValues> = {
  filters: TFormValues,
  navigate: NavigateFunction,
  handleSubmit: (values: TFormValues, { setSubmitting }: FormikHelpers<TFormValues>) => void,
  handleReset: (resetForm: ResetForm<TFormValues>) => void,
};

const useFilter = <
  TFormValues,
  TFilters = Record<string, any>,
  TFiltersFields = Array<String>
>(): UseFilter<TFormValues> => {
  const state = useLocation().state as State<TFilters, TFiltersFields>;

  const navigate = useNavigate();

  const handleSubmit = useCallback((values: TFormValues, { setSubmitting }: FormikHelpers<TFormValues>) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });

    setSubmitting(false);
  }, [navigate, state]);

  const handleReset = useCallback((resetForm: ResetForm<TFormValues>) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: null,
        selectedFilterSet: null,
      },
    });

    resetForm();
  }, [navigate, state]);

  return {
    filters: (state?.filters || {}) as TFormValues,
    navigate,
    handleSubmit,
    handleReset,
  };
};

export default useFilter;
