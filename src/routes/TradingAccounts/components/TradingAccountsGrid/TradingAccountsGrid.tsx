import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { parseErrors } from 'apollo';
import { Sorts } from 'types';
import { TradingAccount } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { accountTypesLabels } from 'constants/accountTypes';
import { Table, Column } from 'components/Table';
import GridPlayerInfo from 'components/GridPlayerInfo';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import { Button } from 'components/Buttons';
import Uuid from 'components/Uuid';
import Badge from 'components/Badge';
import { getPlatformTypeLabel } from 'utils/tradingAccount';
import { useUnarchiveAccountMutation } from './graphql/__generated__/UnarchiveAccountMutation';
import './TradingAccountsGrid.scss';

type Props = {
  content: Array<TradingAccount>,
  loading: boolean,
  last: boolean,
  onFetchMore: () => void,
  onSort: (sorts: Sorts) => void,
};

const TradingAccountsGrid = (props: Props) => {
  const { content, loading, last, onFetchMore, onSort } = props;

  const permission = usePermission();

  const isUnarchiveAllow = permission.allows(permissions.TRADING_ACCOUNT.UNARCHIVE);

  const isArchivedAccountInContent = () => content.some(({ archived }) => archived);

  // ===== Requests ===== //
  const [unarchiveAccountMutation] = useUnarchiveAccountMutation();

  // ===== Handlers ===== //
  const handleUnarchive = async (uuid: string) => {
    try {
      await unarchiveAccountMutation({ variables: { uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ACCOUNTS.GRID.UNARCHIVE.SUCCESS', { uuid }),
      });
    } catch (e) {
      const err = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: (err.error === 'error.account.not.archived' || err.error === 'error.account.unarchive.in-progress')
          ? err.message
          : I18n.t('COMMON.FAIL'),
      });
    }
  };

  // ===== Renders ===== //
  const renderLogin = ({ login, group, platformType }: TradingAccount) => (
    <>
      <div className="TradingAccountsGrid__general">
        <PlatformTypeBadge platformType={platformType}>
          {login}
        </PlatformTypeBadge>
      </div>

      <div className="TradingAccountsGrid__additional">
        {group}
      </div>
    </>
  );

  const renderAccount = ({ uuid, name, accountType, platformType, archived }: TradingAccount) => (
    <>
      <Badge
        text={I18n.t(archived ? 'CONSTANTS.ARCHIVED' : accountTypesLabels[accountType].label)}
        info={accountType === 'DEMO' && !archived}
        success={accountType === 'LIVE' && !archived}
        danger={!!archived}
      >
        <div className="TradingAccountsGrid__general">
          {name}
        </div>
      </Badge>

      <div className="TradingAccountsGrid__additional">
        <Uuid uuid={uuid} uuidPrefix={getPlatformTypeLabel(platformType)} />
      </div>
    </>
  );

  const renderProfile = ({ profile }: TradingAccount) => (
    <GridPlayerInfo profile={profile} />
  );

  const renderAffiliate = ({ affiliate }: TradingAccount) => {
    if (!affiliate) {
      return <span>&mdash;</span>;
    }

    return <div>{affiliate.source}</div>;
  };

  const renderCreatedAt = ({ createdAt }: TradingAccount) => {
    if (!createdAt) {
      return <span>&mdash;</span>;
    }

    return (
      <>
        <div className="TradingAccountsGrid__general">
          {moment.utc(createdAt).local().format('DD.MM.YYYY')}
        </div>

        <div className="TradingAccountsGrid__additional">
          {moment.utc(createdAt).local().format('HH:mm:ss')}
        </div>
      </>
    );
  };

  const renderCredit = ({ credit, currency }: TradingAccount) => (
    <div className="TradingAccountsGrid__general">{currency} {I18n.toCurrency(credit, { unit: '' })}</div>
  );

  const renderLeverage = ({ leverage }: TradingAccount) => (
    <div className="TradingAccountsGrid__general">{leverage}</div>
  );

  const renderBalance = ({ balance, currency }: TradingAccount) => (
    <div className="TradingAccountsGrid__general">
      {currency} {I18n.toCurrency(balance, { unit: '' })}
    </div>
  );

  const renderActions = ({ archived, uuid }: TradingAccount) => (
    <If condition={!!archived}>
      <Button tertiary onClick={() => handleUnarchive(uuid)}>
        {I18n.t('TRADING_ACCOUNTS.GRID.UNARCHIVE.BUTTON')}
      </Button>
    </If>
  );

  return (
    <div className="TradingAccountsGrid">
      <Table
        stickyFromTop={125}
        items={content}
        onSort={onSort}
        loading={loading}
        hasMore={!last}
        onMore={onFetchMore}
      >
        <Column
          sortBy="login"
          header={I18n.t('TRADING_ACCOUNTS.GRID.LOGIN')}
          render={renderLogin}
        />

        <Column
          sortBy="name"
          header={I18n.t('TRADING_ACCOUNTS.GRID.ACCOUNT_ID')}
          render={renderAccount}
        />

        <Column
          header={I18n.t('TRADING_ACCOUNTS.GRID.PROFILE')}
          render={renderProfile}
        />

        <Column
          header={I18n.t('TRADING_ACCOUNTS.GRID.SOURCE_NAME')}
          render={renderAffiliate}
        />

        <Column
          sortBy="createdAt"
          header={I18n.t('TRADING_ACCOUNTS.GRID.DATE')}
          render={renderCreatedAt}
        />

        <Column
          header={I18n.t('TRADING_ACCOUNTS.GRID.CREDIT')}
          render={renderCredit}
        />

        <Column
          sortBy="leverage"
          header={I18n.t('TRADING_ACCOUNTS.GRID.LEVERAGE')}
          render={renderLeverage}
        />

        <Column
          sortBy="balance"
          header={I18n.t('TRADING_ACCOUNTS.GRID.BALANCE')}
          render={renderBalance}
        />

        <If condition={isUnarchiveAllow && isArchivedAccountInContent()}>
          <Column
            header={I18n.t('TRADING_ACCOUNTS.GRID.UNARCHIVE.HEADER')}
            render={renderActions}
          />
        </If>
      </Table>
    </div>
  );
};

export default React.memo(TradingAccountsGrid);
