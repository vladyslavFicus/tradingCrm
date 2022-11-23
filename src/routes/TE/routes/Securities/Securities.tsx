import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { LevelType, Notify } from 'types';
import { parseErrors } from 'apollo';
import { withNotifications, withModals } from 'hoc';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { Button, TrashButton } from 'components/UI';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import PermissionContent from 'components/PermissionContent';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Modal } from 'types/modal';
import EditSecurityModal from 'routes/TE/modals/EditSecurityModal';
import NewSecurityModal from 'routes/TE/modals/NewSecurityModal';
import { tradingEngineTabs } from '../../constants';
import { useSecuritiesQuery, SecuritiesQuery } from './graphql/__generated__/SecuritiesQuery';
import { useDeleteSecurityMutation } from './graphql/__generated__/DeleteSecurityMutation';
import './Securities.scss';

type Security = ExtractApolloTypeFromArray<SecuritiesQuery['tradingEngine']['securities']>;

type Props = {
  modals: {
    newSecurityModal: Modal,
    editSecurityModal: Modal,
    confirmationModal: Modal,
  },
  notify: Notify,
}

const Securities = (props: Props) => {
  const {
    modals: {
      newSecurityModal,
      editSecurityModal,
      confirmationModal,
    },
    notify,
  } = props;

  const permission = usePermission();

  const { data, loading, refetch } = useSecuritiesQuery();

  const [deleteSecurity] = useDeleteSecurityMutation();

  const securities = data?.tradingEngine.securities || [];

  const allowsEditSecurities = permission.allows(permissions.WE_TRADING.EDIT_SECURITIES);

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
      confirmationModal.hide();

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
    confirmationModal.show({
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

        <PermissionContent permissions={permissions.WE_TRADING.CREATE_SECURITIES}>
          <Button
            onClick={handleNewSecurityClick}
            tertiary
            small
          >
            {I18n.t('TRADING_ENGINE.SECURITIES.NEW_SECURITY')}
          </Button>
        </PermissionContent>
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
              <>
                <PermissionContent permissions={permissions.WE_TRADING.DELETE_SECURITY}>
                  <TrashButton onClick={() => handleDeleteSecurityClick(name)} />
                </PermissionContent>
              </>
            )}
          />
        </If>
      </Table>
    </div>
  );
};

export default compose(
  React.memo,
  withNotifications,
  withModals({
    newSecurityModal: NewSecurityModal,
    editSecurityModal: EditSecurityModal,
    confirmationModal: ConfirmActionModal,
  }),
)(Securities);
