import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { withStreams } from 'rsocket';
import { getBrand, getBackofficeBrand } from 'config';
import { TradingAccount } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import { getPlatformTypeLabel } from 'utils/tradingAccount';
import { Link } from 'components/Link';
import { Button } from 'components/Buttons';
import { accountTypesLabels, leverageStatuses } from 'constants/accountTypes';
import { AdjustableTable, Column } from 'components/Table';
import ActionsDropDown from 'components/ActionsDropDown';
import Badge from 'components/Badge';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import UpdateTradingAccountModal, { UpdateTradingAccountModalProps } from 'modals/UpdateTradingAccountModal';
import UpdateLeverageModal, { UpdateLeverageModalProps } from 'modals/UpdateLeverageModal';
import UpdateTradingAccountPasswordModal, {
  UpdateTradingAccountPasswordModalProps,
} from 'modals/UpdateTradingAccountPasswordModal';
import { useApproveChangingLeverageMutation } from './graphql/__generated__/ApproveChangingLeverageMutation';
import { useRejectChangingLeverageMutation } from './graphql/__generated__/RejectChangingLeverageMutation';
import { useToggleDisabledTradingAccountMutation } from './graphql/__generated__/ToggleDisabledTradingAccountMutation';
import './ClientTradingAccountsGrid.scss';

type Statistic = {
  login: number,
  balance: number,
  margin: number,
  freeMargin: number,
  marginLevel: number,
  equity: number,
  openPnL: number,
  closedPnL: number,
};

type StreamData = {
  data: Statistic,
};

type Props = {
  // eslint-disable-next-line
  streamLogins: Array<number>,
  profileUUID: string,
  tradingAccounts: Array<TradingAccount>,
  loading: boolean,
  onRefetch: () => void,
  statistics$?: Record<string, Statistic>,
};

const ClientTradingAccountsGrid = (props: Props) => {
  const { profileUUID, tradingAccounts, loading, onRefetch, statistics$ = {} } = props;

  const brand = getBrand();
  const columnsOrder = getBackofficeBrand()?.tables?.clientTradingAccounts?.columnsOrder || [];

  // ===== Permissions ===== //
  const permission = usePermission();
  const isReadOnly = permission.allows(permissions.TRADING_ACCOUNT.READ_ONLY);
  const canRenameAccount = permission.allows(permissions.TRADING_ACCOUNT.RENAME_ACCOUNT);
  const updatePasswordPermission = permission.allows(permissions.TRADING_ACCOUNT.UPDATE_PASSWORD);

  // ===== Modals ===== //
  const updateTradingAccountModal = useModal<UpdateTradingAccountModalProps>(UpdateTradingAccountModal);
  const updateLeverageModal = useModal<UpdateLeverageModalProps>(UpdateLeverageModal);
  const updateTradingAccountPasswordModal = useModal<UpdateTradingAccountPasswordModalProps>(
    UpdateTradingAccountPasswordModal,
  );

  // ===== Requests ===== //
  const [approveChangingLeverageMutation] = useApproveChangingLeverageMutation();
  const [rejectChangingLeverageMutation] = useRejectChangingLeverageMutation();
  const [toggleDisabledTradingAccountMutation] = useToggleDisabledTradingAccountMutation();

  // ===== Handlers ===== //
  const handleSetTradingAccountReadonly = (accountUUID: string, readOnly: boolean) => async () => {
    try {
      await toggleDisabledTradingAccountMutation({ variables: { accountUUID, readOnly } });

      onRefetch();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  const handleRejectChangeLeverage = (accountUUID: string) => async () => {
    try {
      await rejectChangingLeverageMutation({ variables: { accountUUID } });

      onRefetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CANCEL_NOTIFICATION'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  const handleApproveChangeLeverage = (accountUUID: string) => async () => {
    try {
      await approveChangingLeverageMutation({ variables: { accountUUID } });

      onRefetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.APPROVE_NOTIFICATION'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  // ===== Renders ===== //
  const renderTradingAccountColumn = ({ accountUUID, name, accountType, platformType, archived }: TradingAccount) => (
    <>
      <Badge
        text={I18n.t(archived ? 'CONSTANTS.ARCHIVED' : accountTypesLabels[accountType].label)}
        info={accountType === 'DEMO' && !archived}
        success={accountType === 'LIVE' && !archived}
        danger={!!archived}
      >
        <div className="ClientTradingAccountsGrid__cell-main">
          {name}
        </div>
      </Badge>

      <div className="ClientTradingAccountsGrid__cell-sub">
        <Uuid uuid={accountUUID} uuidPrefix={getPlatformTypeLabel(platformType)} />
      </div>
    </>
  );

  const renderLoginColumn = ({ login, group, platformType }: TradingAccount) => (
    <>
      <div className="ClientTradingAccountsGrid__cell-main">
        <PlatformTypeBadge platformType={platformType}>
          {login}
        </PlatformTypeBadge>
      </div>

      <div className="ClientTradingAccountsGrid__cell-sub">
        {group}
      </div>
    </>
  );

  const renderBalanceColumn = ({ balance, currency }: TradingAccount) => (
    <div className="ClientTradingAccountsGrid__cell-main">
      {currency} {I18n.toCurrency(balance, { unit: '' })}
    </div>
  );

  const renderCreditColumn = ({ credit, currency }: TradingAccount) => (
    <div className="ClientTradingAccountsGrid__cell-main">{currency} {I18n.toCurrency(credit, { unit: '' })}</div>
  );

  const renderMarginLevelColumn = ({ login, platformType }: TradingAccount) => {
    const statistic$ = statistics$[login];

    return (
      <Choose>
        {/* All accounts except WET doesn't support account statistic */}
        <When condition={platformType !== 'WET'}>
          &mdash;
        </When>

        <Otherwise>
          <div className="ClientTradingAccountsGrid__cell-main">
            {Number((statistic$?.marginLevel || 0) * 100).toFixed(2)}%
          </div>
        </Otherwise>
      </Choose>
    );
  };

  const renderProfitColumn = ({ login, platformType }: TradingAccount) => {
    const statistic$ = statistics$[login];

    return (
      <Choose>
        {/* All accounts except WET doesn't support account statistic */}
        <When condition={platformType !== 'WET'}>
          &mdash;
        </When>

        <Otherwise>
          <div className="ClientTradingAccountsGrid__cell-main">
            {Number(statistic$?.openPnL || 0).toFixed(2)}
          </div>
        </Otherwise>
      </Choose>
    );
  };

  const renderLeverageColumn = (tradingAccount: TradingAccount) => {
    const { leverage, accountUUID, lastLeverageChangeRequest } = tradingAccount;

    const { changeLeverageFrom, changeLeverageTo, status, createDate } = lastLeverageChangeRequest || {};

    return (
      <>
        <Choose>
          <When condition={!!tradingAccount.lastLeverageChangeRequest}>
            <Choose>
              <When condition={status === 'COMPLETED'}>
                <div>
                  <div className="ClientTradingAccountsGrid__cell-main">
                    {changeLeverageTo}
                  </div>

                  <div className="ClientTradingAccountsGrid__cell-sub">
                    {I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.FROM')} {changeLeverageFrom}
                  </div>
                </div>
              </When>

              <Otherwise>
                <div>
                  <div className="ClientTradingAccountsGrid__cell-main">
                    {changeLeverageFrom}
                  </div>

                  <div className="ClientTradingAccountsGrid__cell-sub">
                    {I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.TO')} {changeLeverageTo}
                  </div>
                </div>
              </Otherwise>
            </Choose>
          </When>

          <Otherwise>
            <div className="ClientTradingAccountsGrid__cell-main">{leverage}</div>
          </Otherwise>
        </Choose>

        <div
          className={
            classNames(
              'ClientTradingAccountsGrid__cell-main',
              'ClientTradingAccountsGrid__cell-main--upper',
              'ClientTradingAccountsGrid__leverage-status',
              {
                'ClientTradingAccountsGrid__leverage-status--pending': status === leverageStatuses.PENDING,
                'ClientTradingAccountsGrid__leverage-status--completed': status === leverageStatuses.COMPLETED,
                'ClientTradingAccountsGrid__leverage-status--canceled': status === leverageStatuses.CANCELED,
                'ClientTradingAccountsGrid__leverage-status--rejected': status === leverageStatuses.REJECTED,
                'ClientTradingAccountsGrid__leverage-status--failed': status === leverageStatuses.FAILED,
              },
            )
          }
        >
          {status}
        </div>

        <If condition={!!createDate}>
          <div className="ClientTradingAccountsGrid__cell-sub">
            {`${I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.SINCE')}
              ${moment.utc(`${createDate}`).local().format('DD.MM.YYYY HH:mm')}`
            }
          </div>
        </If>

        <If condition={status === 'PENDING'}>
          <Button
            className="ClientTradingAccountsGrid__cell-button"
            onClick={handleRejectChangeLeverage(accountUUID)}
            tertiary
            small
          >
            {I18n.t('COMMON.REJECT')}
          </Button>

          <Button
            className="ClientTradingAccountsGrid__cell-button"
            onClick={handleApproveChangeLeverage(accountUUID)}
            tertiary
            small
          >
            {I18n.t('COMMON.APPROVE')}
          </Button>
        </If>
      </>
    );
  };

  const renderTradingStatusColumn = ({ readOnly, readOnlyUpdateTime, readOnlyUpdatedBy, operator }: TradingAccount) => (
    <>
      <div className={
        classNames(
          'ClientTradingAccountsGrid__cell-main',
          'ClientTradingAccountsGrid__cell-main--upper',
          'ClientTradingAccountsGrid__status',
          {
            'ClientTradingAccountsGrid__status--disabled': readOnly,
            'ClientTradingAccountsGrid__status--enabled': !readOnly,
          },
        )
      }
      >
        {I18n.t(`CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.${!readOnly ? 'ENABLED' : 'DISABLED'}`)}
      </div>

      <Choose>
        <When condition={readOnlyUpdatedBy === 'SYSTEM'}>
          <div
            className={
              classNames(
                'ClientTradingAccountsGrid__cell-main',
                'ClientTradingAccountsGrid__cell-main--small',
              )
            }
          >
            {I18n.t('CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.UPDATED_BY', { updatedBy: 'SYSTEM' })}
          </div>
        </When>

        <When condition={!!readOnlyUpdatedBy && !!operator?.fullName}>
          <Link to={`/operators/${readOnlyUpdatedBy}`}>
            <div
              className={
                classNames(
                  'ClientTradingAccountsGrid__cell-main',
                  'ClientTradingAccountsGrid__cell-main--small',
                )
              }
            >
              {I18n.t('CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.UPDATED_BY', { updatedBy: operator?.fullName })}
            </div>
          </Link>
        </When>
      </Choose>

      <If condition={!!readOnlyUpdateTime}>
        <div className="ClientTradingAccountsGrid__cell-sub">
          {I18n.t('CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.UPDATED_AT', {
            updatedAt: moment(`${readOnlyUpdateTime}`).format('DD.MM.YYYY HH:mm'),
          })}
        </div>
      </If>
    </>
  );

  const renderServerColumn = ({ accountType, platformType }: TradingAccount) => (
    <div className="ClientTradingAccountsGrid__cell-main">{getPlatformTypeLabel(platformType)} {accountType}</div>
  );

  const renderActionsColumn = (tradingAccount: TradingAccount) => {
    const { readOnly, accountType, archived, accountUUID, login, name, group, leverage, platformType } = tradingAccount;
    const dropDownActions = [];

    if (platformType !== 'WET') {
      dropDownActions.push({
        label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
        onClick: () => updateTradingAccountPasswordModal.show({ accountUUID, profileUUID, login }),
      });
    }

    if (canRenameAccount) {
      dropDownActions.push({
        label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.RENAME'),
        onClick: () => updateTradingAccountModal.show({
          name: name || '',
          accountUUID,
          onSuccess: onRefetch,
        }),
      });
    }

    if (brand[platformType.toLowerCase()]?.leveragesChangingRequest?.length) {
      dropDownActions.push({
        label: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        onClick: () => updateLeverageModal.show({
          name: name || '',
          login,
          group,
          leverage,
          accountType,
          platformType,
          archived,
          accountUUID,
          onSuccess: onRefetch,
        }),
      });
    }

    if (isReadOnly) {
      if (accountType !== 'DEMO') {
        dropDownActions.push({
          label: I18n.t(`CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.${!readOnly ? 'DISABLE' : 'ENABLE'}`),
          onClick: handleSetTradingAccountReadonly(accountUUID, !readOnly),
        });
      }
    }

    if (!archived) {
      return (<ActionsDropDown items={dropDownActions} />);
    }

    return null;
  };

  return (
    <div className="ClientTradingAccountsGrid">
      <AdjustableTable
        columnsOrder={columnsOrder}
        stickyFromTop={189}
        items={tradingAccounts}
        loading={loading}
      >
        <Column
          name="account"
          header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.TRADING_ACC')}
          render={renderTradingAccountColumn}
        />

        <Column
          name="login"
          header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.LOGIN')}
          render={renderLoginColumn}
        />

        <Column
          name="balance"
          header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.BALANCE/EQUITY')}
          render={renderBalanceColumn}
        />

        <Column
          name="credit"
          header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.CREDIT')}
          render={renderCreditColumn}
        />
        <Column
          name="leverage"
          header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.LEVERAGE')}
          render={renderLeverageColumn}
        />

        <Column
          name="marginLevel"
          header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.MARGIN_LEVEL')}
          render={renderMarginLevelColumn}
        />

        <Column
          name="profit"
          header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.PROFIT')}
          render={renderProfitColumn}
        />

        <Column
          name="status"
          header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.TRADING_STATUS')}
          render={renderTradingStatusColumn}
        />

        <Column
          name=""
          header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.SERVER')}
          render={renderServerColumn}
        />

        <If condition={updatePasswordPermission}>
          <Column
            name="actions"
            width={60}
            render={renderActionsColumn}
          />
        </If>
      </AdjustableTable>
    </div>
  );
};

export default compose(
  React.memo,
  withStreams(({ streamLogins }: Props) => ({
    statistics$: {
      route: 'streamAccountStatisticsByLogins',
      data: { logins: streamLogins },
      accumulator: (curr: StreamData, next: StreamData) => ({ ...curr, [next.data.login]: next.data }),
      skip: !streamLogins.length,
    },
  })),
)(ClientTradingAccountsGrid);
