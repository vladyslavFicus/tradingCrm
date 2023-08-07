import { useCallback, useMemo, useState } from 'react';
import I18n from 'i18n-js';
import { FormikHelpers } from 'formik';
import { permissions } from 'config';
import { Authority, Operator } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { unAvailableDepartments } from 'routes/Operators/constants';
import { useAddAuthorityMutation } from '../graphql/__generated__/AddAuthorityMutation';
import { useRemoveAuthorityMutation } from '../graphql/__generated__/RemoveAuthorityMutation';
import { useAuthoritiesOptionsQuery } from '../graphql/__generated__/AuthoritiesOptionsQuery';

type FormValues = {
  department: string,
  role: string,
};

type Props = {
  operator: Operator,
  onRefetch: () => void,
};

type UseOperatorDepartments = {
  allowDeleteAuthority: boolean,
  allowAddAuthority: boolean,
  availableDepartments: Array<string>,
  isVisibleCreationForm: boolean,
  operatorAuthorities: Array<Authority>,
  availableRoles: (department:string) => Array<string>,
  toggleVisibilityCreationForm: () => void,
  handleAddAuthority: (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => void,
  handleRemoveAuthority: (department: string, role: string) => void,
};

const useOperatorDepartments = (props: Props): UseOperatorDepartments => {
  const {
    operator: {
      uuid,
      authorities,
    },
    onRefetch,
  } = props;

  const permission = usePermission();

  const allowDeleteAuthority = permission.allows(permissions.OPERATORS.DELETE_AUTHORITY);
  const allowAddAuthority = permission.allows(permissions.OPERATORS.ADD_AUTHORITY);

  const [isVisibleCreationForm, setIsVisibleCreationForm] = useState(false);

  // ===== Requests ===== //
  const authoritiesOptionsQuery = useAuthoritiesOptionsQuery();

  const operatorAuthorities = authorities || [];
  const queryAuthorities: Record<string, Array<string>> = authoritiesOptionsQuery?.data?.authoritiesOptions || {};
  const availableRoles = (department: string) => queryAuthorities[department] || [];

  const operatorDepartments = useMemo(() => operatorAuthorities.map(({ department }) => department), [authorities]);

  const availableDepartments = useMemo(() => Object.keys(queryAuthorities)
    .filter(department => ![...operatorDepartments, ...unAvailableDepartments]
      .includes(department)), [queryAuthorities]);

  const [addAuthorityMutation] = useAddAuthorityMutation();

  const [removeAuthorityMutation] = useRemoveAuthorityMutation();

  // ===== Handlers ===== //
  const toggleVisibilityCreationForm = useCallback(() => {
    setIsVisibleCreationForm(prevIsVisibleCreationForm => !prevIsVisibleCreationForm);
  }, []);

  const handleAddAuthority = useCallback(async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    try {
      await addAuthorityMutation({ variables: { ...values, uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_SUCCESS.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_SUCCESS.MESSAGE'),
      });

      onRefetch();
      resetForm();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.ADD_AUTHORITY_ERROR.MESSAGE'),
      });
    }
  }, [uuid]);

  const handleRemoveAuthority = async (department: string, role: string) => {
    try {
      await removeAuthorityMutation({
        variables: {
          uuid,
          role,
          department,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_SUCCESS.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_SUCCESS.MESSAGE'),
      });

      onRefetch();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.DELETE_AUTHORITY_ERROR.MESSAGE'),
      });
    }
  };

  return {
    allowDeleteAuthority,
    allowAddAuthority,
    availableDepartments,
    isVisibleCreationForm,
    operatorAuthorities,
    availableRoles,
    toggleVisibilityCreationForm,
    handleAddAuthority,
    handleRemoveAuthority,
  };
};

export default useOperatorDepartments;
