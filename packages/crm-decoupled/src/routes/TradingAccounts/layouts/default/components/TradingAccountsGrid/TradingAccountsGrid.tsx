import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Button } from 'components';
import { Sorts } from 'types';
import { AccountView } from '__generated__/types';
import { accountTypesLabels } from 'constants/accountTypes';
import { Table, Column } from 'components/Table';
import GridPlayerInfo from 'components/GridPlayerInfo';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import HideText from 'components/HideText';
import Uuid from 'components/Uuid';
import Badge from 'components/Badge';
import { getPlatformTypeLabel } from 'utils/tradingAccount';
import useTradingAccountsGrid from 'routes/TradingAccounts/hooks/useTradingAccountsGrid';
import './TradingAccountsGrid.scss';

type Props = {
  content: Array<AccountView>,
  loading: boolean,
  last: boolean,
  onFetchMore: () => void,
  onSort: (sorts: Sorts) => void,
};

const TradingAccountsGrid = (props: Props) => {
  const { content, loading, last, onFetchMore, onSort } = props;

  const {
    isUnarchiveAllow,
    isArchivedAccountInContent,
    handleUnarchive,
  } = useTradingAccountsGrid({ content });

  // ===== Renders ===== //
  const renderLogin = useCallback(({ login, group, platformType }: AccountView) => (
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
  ), []);

  const renderAccount = useCallback(({ uuid, name, accountType, platformType, archived }: AccountView) => (
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
  ), []);

  const renderProfile = useCallback(({ profile }: AccountView) => (
    <GridPlayerInfo profile={profile} />
  ), []);

  const renderAffiliate = useCallback(({ affiliate }: AccountView) => {
    if (!affiliate) {
      return <span>&mdash;</span>;
    }

    return <HideText text={affiliate.source || ''} />;
  }, []);

  const renderCreatedAt = useCallback(({ createdAt }: AccountView) => {
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
  }, []);

  const renderCredit = useCallback(({ credit, currency }: AccountView) => (
    <div className="TradingAccountsGrid__general">{currency} {I18n.toCurrency(credit, { unit: '' })}</div>
  ), []);

  const renderLeverage = useCallback(({ leverage }: AccountView) => (
    <div className="TradingAccountsGrid__general">{leverage}</div>
  ), []);

  const renderBalance = useCallback(({ balance, currency }: AccountView) => (
    <div className="TradingAccountsGrid__general">
      {currency} {I18n.toCurrency(balance, { unit: '' })}
    </div>
  ), []);

  const renderActions = useCallback(({ archived, uuid }: AccountView) => (
    <If condition={!!archived}>
      <Button tertiary onClick={() => handleUnarchive(uuid)}>
        {I18n.t('TRADING_ACCOUNTS.GRID.UNARCHIVE.BUTTON')}
      </Button>
    </If>
  ), []);

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

        <If condition={isUnarchiveAllow && isArchivedAccountInContent}>
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
