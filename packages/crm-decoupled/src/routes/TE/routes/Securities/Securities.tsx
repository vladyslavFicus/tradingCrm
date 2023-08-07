import React from 'react';
import I18n from 'i18n-js';
import { Button, TrashButton } from 'components';
import { parseErrors } from 'apollo';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import EditSecurityModal, { EditSecurityModalProps } from 'routes/TE/modals/EditSecurityModal';
import NewSecurityModal, { NewSecurityModalProps } from 'routes/TE/modals/NewSecurityModal';
import { tradingEngineTabs } from '../../constants';
import { useSecuritiesQuery, SecuritiesQuery } from './graphql/__generated__/SecuritiesQuery';
import { useDeleteSecurityMutation } from './graphql/__generated__/DeleteSecurityMutation';
import './Securities.scss';

type Security = ExtractApolloTypeFromArray<SecuritiesQuery['tradingEngine']['securities']>;

const Securities = () => {
  const permission = usePermission();

  const { data, loading, refetch } = useSecuritiesQuery();

  const [deleteSecurity] = useDeleteSecurityMutation();

  const securities = data?.tradingEngine.securities || [];

  const allowsEditSecurities = permission.allows(permissions.WE_TRADING.EDIT_SECURITIES);

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const editSecurityModal = useModal<EditSecurityModalProps>(EditSecurityModal);
  const newSecurityModal = useModal<NewSecurityModalProps>(NewSecurityModal);

  // ===== Handlers ===== //
  const handleNewSecurityClick = () => {
    newSecurityModal.show({
      onSuccess: refetch,
    });
  };

  const handleDeleteSecurity = async (securityName: string) => {
    try {
      await deleteSecurity({ variables: { securityName } });

      await refetch();
      confirmActionModal.hide();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.SECURITIES.NOTIFICATION.DELETE.SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      let message = I18n.t('TRADING_ENGINE.GROUPS.NOTIFICATION.DELETE.FAILED');

      // If security has symbols
      if (error.error === 'error.security.has.symbols') {
        message = I18n.t('TRADING_ENGINE.SECURITIES.NOTIFICATION.DELETE.HAS_SYMBOLS', {
          symbolsCount: error.errorParameters['error.security.has.symbols'].split(',').length,
          symbols: error.errorParameters['error.security.has.symbols'],
          securityName,
        });
      }

      // If security assigned to group
      if (error.error === 'error.security.has.group.securities') {
        message = I18n.t('TRADING_ENGINE.SECURITIES.NOTIFICATION.DELETE.HAS_GROUP_SECURITIES', {
          groupsCount: error.errorParameters['error.security.has.group.securities'].split(',').length,
          groups: error.errorParameters['error.security.has.group.securities'],
          securityName,
        });
      }

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message,
      });
    }
  };

  const handleDeleteSecurityClick = (securityName: string) => {
    confirmActionModal.show({
      onSubmit: () => handleDeleteSecurity(securityName),
      modalTitle: I18n.t('TRADING_ENGINE.SECURITIES.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.SECURITIES.CONFIRMATION.DELETE.DESCRIPTION', { securityName }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  return (
    <div className="Securities">
      <Tabs items={tradingEngineTabs} />

      <div className="Securities__header">
        <span className="Securities__title">
          <strong>{securities.length}</strong>&nbsp;{I18n.t('TRADING_ENGINE.SECURITIES.HEADLINE')}
        </span>

        <If condition={permission.allows(permissions.WE_TRADING.CREATE_SECURITIES)}>
          <Button
            data-testid="Securities-newSecurityButton"
            onClick={handleNewSecurityClick}
            tertiary
            small
          >
            {I18n.t('TRADING_ENGINE.SECURITIES.NEW_SECURITY')}
          </Button>
        </If>
      </div>

      <Table
        items={securities}
        loading={loading}
        stickyFromTop={127}
      >
        <Column
          width={200}
          header={I18n.t('TRADING_ENGINE.SECURITIES.GRID.NAME')}
          render={({ name }: Security) => (
            <div
              className="Securities__cell-primary Securities__cell-primary--pointer"
              onClick={allowsEditSecurities ? () => editSecurityModal.show({
                name,
                onSuccess: refetch,
              }) : () => {}}
            >
              {name}
            </div>
          )}
        />
        <Column
          width={400}
          header={I18n.t('TRADING_ENGINE.SECURITIES.GRID.DESCRIPTION')}
          render={({ description }: Security) => (
            <div className="Securities__cell-primary">
              <Choose>
                <When condition={!!description}>
                  {description}
                </When>
                <Otherwise>
                  &mdash;
                </Otherwise>
              </Choose>
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.SECURITIES.GRID.SYMBOLS')}
          render={({ symbols }: Security) => (
            <div className="Securities__cell-primary">
              <Choose>
                <When condition={!!symbols?.length}>
                  {symbols.join(', ')}
                </When>
                <Otherwise>
                  &mdash;
                </Otherwise>
              </Choose>
            </div>
          )}
        />
        <If condition={permission.allows(permissions.WE_TRADING.DELETE_SECURITY)}>
          <Column
            width={120}
            header={I18n.t('TRADING_ENGINE.SECURITIES.GRID.ACTIONS')}
            render={({ name }: Security) => (
              <TrashButton
                data-testid="Securities-trashButton"
                onClick={() => handleDeleteSecurityClick(name)}
              />
            )}
          />
        </If>
      </Table>
    </div>
  );
};

export default React.memo(Securities);
