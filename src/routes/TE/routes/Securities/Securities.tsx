import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import withModals from 'hoc/withModals';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { Button } from 'components/UI';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import PermissionContent from 'components/PermissionContent';
import { Modal } from 'types/modal';
import EditSecurityModal from 'routes/TE/modals/EditSecurityModal';
import NewSecurityModal from 'routes/TE/modals/NewSecurityModal';
import { tradingEngineTabs } from '../../constants';
import {
  useSecuritiesQuery,
  SecuritiesQuery,
} from './graphql/__generated__/SecuritiesQuery';
import './Securities.scss';

type Security = ExtractApolloTypeFromArray<SecuritiesQuery['tradingEngine']['securities']>;

interface Props {
  modals: {
    newSecurityModal: Modal,
    editSecurityModal: Modal,
  },
}

const Securities = (props: Props) => {
  const { data, loading, refetch } = useSecuritiesQuery();
  const permission = usePermission();

  const securities = data?.tradingEngine.securities || [];

  const handleNewSecuritiesClick = () => {
    const {
      modals: {
        newSecurityModal,
      },
    } = props;

    newSecurityModal.show({
      onSuccess: refetch,
    });
  };

  const allowsEditSecurities = permission.allows(permissions.WE_TRADING.EDIT_SECURITIES);

  return (
    <div className="Securities">
      <Tabs items={tradingEngineTabs} />

      <div className="Securities__header">
        <span className="Securities__title">
          <strong>{securities.length}</strong>&nbsp;{I18n.t('TRADING_ENGINE.SECURITIES.HEADLINE')}
        </span>

        <PermissionContent permissions={permissions.WE_TRADING.CREATE_SECURITIES}>
          <Button
            onClick={handleNewSecuritiesClick}
            commonOutline
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
              onClick={allowsEditSecurities ? () => props.modals.editSecurityModal.show({
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
      </Table>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    newSecurityModal: NewSecurityModal,
    editSecurityModal: EditSecurityModal,
  }),
)(Securities);
