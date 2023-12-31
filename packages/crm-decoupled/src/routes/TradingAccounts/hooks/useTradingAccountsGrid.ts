import { useCallback, useMemo } from 'react';
import I18n from 'i18n-js';
import { Config, notify, Types, usePermission, parseErrors } from '@crm/common';
import { AccountView } from '__generated__/types';
import { useUnarchiveAccountMutation } from '../graphql/__generated__/UnarchiveAccountMutation';

type Props = {
  content: Array<AccountView>,
};

const useTradingAccountsGrid = (props: Props) => {
  const { content } = props;

  // ===== Permissions ===== //
  const permission = usePermission();
  const isUnarchiveAllow = permission.allows(Config.permissions.TRADING_ACCOUNT.UNARCHIVE);

  // ===== Requests ===== //
  const [unarchiveAccountMutation] = useUnarchiveAccountMutation();

  // ===== Handlers ===== //
  const handleUnarchive = useCallback(async (uuid: string) => {
    try {
      await unarchiveAccountMutation({ variables: { uuid } });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ACCOUNTS.GRID.UNARCHIVE.SUCCESS', { uuid }),
      });
    } catch (e) {
      const err = parseErrors(e);

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: (err.error === 'error.account.not.archived' || err.error === 'error.account.unarchive.in-progress')
          ? err.message
          : I18n.t('COMMON.FAIL'),
      });
    }
  }, []);

  const isArchivedAccountInContent = useMemo(() => content.some(({ archived }) => archived), [content]);

  return {
    isUnarchiveAllow,
    isArchivedAccountInContent,
    handleUnarchive,
  };
};

export default useTradingAccountsGrid;
