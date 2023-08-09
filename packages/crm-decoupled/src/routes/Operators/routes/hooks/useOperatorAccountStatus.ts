import { ReactNode, useCallback, useMemo, useState } from 'react';
import I18n from 'i18n-js';
import { Config } from '@crm/common';
import { Operator } from '__generated__/types';
import { useModal } from 'providers/ModalProvider';
import { LevelType, notify } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import ChangeAccountStatusModal, { ChangeAccountStatusModalProps, FormValues } from 'modals/ChangeAccountStatusModal';
import { StatusAction, statusActions, statuses } from 'constants/operators';
import { useOperatorRelationsCountQuery } from '../graphql/__generated__/OperatorRelationsCountQuery';
import { useOperatorAccountStatusMutation } from '../graphql/__generated__/OperatorAccountStatusMutation';

type Messages = {
  name: string,
  link: string,
  count: number,
};

type UseOperatorAccountStatus = {
  allowUpdateAccountStatus: boolean,
  isDropDownOpen: boolean,
  actions: Array<StatusAction>,
  messages: Array<Messages>,
  toggleDropdown: () => void,
  handleSelectStatus: (reasons: Record<string, string>, action: string, getMessages: () => ReactNode) => void,
};

type Props = {
  operator: Operator,
  onRefetch: () => void,
};

const useOperatorAccountStatus = (props: Props): UseOperatorAccountStatus => {
  const {
    operator: {
      uuid,
      operatorStatus,
    },
    onRefetch,
  } = props;

  const changeAccountStatusModal = useModal<ChangeAccountStatusModalProps>(ChangeAccountStatusModal);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const permission = usePermission();

  const allowUpdateAccountStatus = permission.allows(Config.permissions.OPERATORS.UPDATE_STATUS);

  const actions = statusActions[operatorStatus as statuses] || [];

  // ===== Requests ===== //
  const [operatorAccountStatusMutation] = useOperatorAccountStatusMutation();

  const operatorRelationsCountQuery = useOperatorRelationsCountQuery({ variables: { uuid } });

  const { customersCount, leadsCount, rulesCount } = operatorRelationsCountQuery.data?.operatorRelationsCount || {};

  // ===== Handlers ===== //
  const toggleDropdown = useCallback(() => {
    setIsDropDownOpen(isPrevState => !isPrevState);
  }, []);

  const handleChangeAccountStatus = useCallback(async ({ reason }: FormValues, status: string) => {
    try {
      await operatorAccountStatusMutation({
        variables: {
          uuid,
          status,
          reason,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.MESSAGE'),
      });

      onRefetch();

      changeAccountStatusModal.hide();
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.MESSAGE'),
      });
    }
  }, [uuid, changeAccountStatusModal, onRefetch, operatorAccountStatusMutation]);

  const handleSelectStatus = useCallback((
    reasons: Record<string, string>,
    action: string,
    getMessages: () => ReactNode,
  ) => {
    changeAccountStatusModal.show({
      reasons,
      message: action === 'CLOSED' ? getMessages() : null,
      onSubmit: (values: FormValues) => handleChangeAccountStatus(values, action),
    });
  }, [changeAccountStatusModal, handleChangeAccountStatus]);

  const messages = useMemo(() => [
    { name: 'CLIENTS', link: '/clients/list', count: customersCount || 0 },
    { name: 'LEADS', link: '/leads/list', count: leadsCount || 0 },
    { name: 'RULES', link: '/sales-rules', count: rulesCount || 0 },
  ].filter(({ count }) => !!count), [customersCount, leadsCount, rulesCount]);

  return {
    allowUpdateAccountStatus,
    isDropDownOpen,
    actions,
    messages,
    toggleDropdown,
    handleSelectStatus,
  };
};

export default useOperatorAccountStatus;
