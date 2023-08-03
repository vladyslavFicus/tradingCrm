import { useCallback } from 'react';
import { omit } from 'lodash';
import { SetFieldValue } from 'types/formik';
import { useFilesCategoriesQuery } from '../graphql/__generated__/FilesCategoriesQuery';

const useFilesGridFilter = <FormValues>() => {
  // ===== Requests ===== //
  const { data } = useFilesCategoriesQuery();

  const categoriesData = data?.filesCategories || {};
  const categories = omit(categoriesData, '__typename') as Record<string, Array<string>>;
  const verificationTypes = Object.keys(categories);

  // ===== Handlers ===== //
  const handleVerificationTypeChange = useCallback((value: string, setFieldValue: SetFieldValue<FormValues>) => {
    setFieldValue('verificationType', value);

    if (value === 'OTHER') {
      setFieldValue('documentType', value);
    } else {
      setFieldValue('documentType', '');
    }
  }, []);

  return {
    categories,
    verificationTypes,
    handleVerificationTypeChange,
  };
};

export default useFilesGridFilter;
