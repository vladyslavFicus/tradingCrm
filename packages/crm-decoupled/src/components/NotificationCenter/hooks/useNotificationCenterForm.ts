import { useCallback } from 'react';
import { Types } from '@crm/common';
import { Filter } from '../types';

type FormValues = {
  read?: boolean,
  notificationTypes?: Array<string>,
};

type Props = {
  onSubmit: (props: Filter) => void,
};

const useNotificationCenterForm = (props: Props) => {
  const { onSubmit } = props;

  const handleReset = useCallback((resetForm: Types.ResetForm<FormValues>) => {
    onSubmit({});
    resetForm();
  }, []);

  return { handleReset };
};

export default useNotificationCenterForm;
