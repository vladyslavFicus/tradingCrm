import { useCallback } from 'react';
import I18n from 'i18n-js';
import { omit } from 'lodash';
import { Constants, parseErrors, notify, Types } from '@crm/common';
import { Operator } from '__generated__/types';
import { useUpdateOperatorUserTypeMutation } from '../graphql/__generated__/UpdateOperatorUserTypeMutation';

type FormValues = {
  userType: string,
};

type Props = {
  operator: Operator,
  onRefetch: () => void,
};

type UseOperatorHierarchyUserType = {
  userTypesOptions: Array<string>,
  handleSubmit: (values: FormValues) => void,
};

const useOperatorHierarchyUserType = (props: Props): UseOperatorHierarchyUserType => {
  const { operator, onRefetch } = props;

  const userTypesOptions = Object.keys(omit(Constants.userTypes, ['CUSTOMER', 'LEAD_CUSTOMER', 'AFFILIATE_PARTNER']));

  // ===== Requests ===== //
  const [updateOperatorUserTypeMutation] = useUpdateOperatorUserTypeMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async ({ userType }: FormValues) => {
    try {
      await updateOperatorUserTypeMutation({
        variables: {
          operatorId: operator.uuid,
          userType,
        },
      });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.SUCCESS_UPDATE_TYPE'),
      });

      onRefetch();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: error.message || I18n.t('OPERATORS.PROFILE.HIERARCHY.ERROR_UPDATE_TYPE'),
      });
    }
  }, [operator.uuid]);

  return {
    userTypesOptions,
    handleSubmit,
  };
};

export default useOperatorHierarchyUserType;
