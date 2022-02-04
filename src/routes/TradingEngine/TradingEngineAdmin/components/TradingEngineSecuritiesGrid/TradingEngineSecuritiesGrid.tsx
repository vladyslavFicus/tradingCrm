import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import withModals from 'hoc/withModals';
import { Button } from 'components/UI';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import { Modal } from 'types/modal';
import EditSecurityModal from 'routes/TradingEngine/TradingEngineAdmin/modals/EditSecurityModal';
import NewSecurityModal from 'routes/TradingEngine/TradingEngineAdmin/modals/NewSecurityModal';
import { tradingEngineAdminTabs } from '../../constants';
import {
  useTradingEngineSecuritiesQuery,
  TradingEngineSecuritiesQuery,
} from './graphql/__generated__/TESecuritiesQuery';
import './TradingEngineSecuritiesGrid.scss';

type Security = ExtractApolloTypeFromArray<TradingEngineSecuritiesQuery['tradingEngineSecurities']>;

interface Props {
  modals: {
    newSecurityModal: Modal,
    editSecurityModal: Modal,
  },
}

const TradingEngineSecuritiesGrid = (props: Props) => {
  const { data, loading, refetch } = useTradingEngineSecuritiesQuery();

  const securities = data?.tradingEngineSecurities || [];

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

  return (
    <div className="TradingEngineSecuritiesGrid">
      <Tabs items={tradingEngineAdminTabs} />

      <div className="TradingEngineSecuritiesGrid__header">
        <span className="TradingEngineSecuritiesGrid__title">
          <strong>{securities.length}</strong>&nbsp;{I18n.t('TRADING_ENGINE.SECURITIES.HEADLINE')}
        </span>
        <Button
          onClick={handleNewSecuritiesClick}
          commonOutline
          small
        >
          {I18n.t('TRADING_ENGINE.SECURITIES.NEW_SECURITY')}
        </Button>
      </div>

      <div className="TradingEngineSecuritiesGrid__card">
        <Table
          items={securities}
          loading={loading}
        >
          <Column
            width={200}
            header={I18n.t('TRADING_ENGINE.SECURITIES.GRID.NAME')}
            render={({ name }: Security) => (
              <div
                className="TradingEngineSecuritiesGrid__cell-primary TradingEngineSecuritiesGrid__cell-primary--pointer"
                onClick={() => props.modals.editSecurityModal.show({
                  name,
                  onSuccess: refetch,
                })}
              >
                {name}
              </div>
            )}
          />
          <Column
            width={400}
            header={I18n.t('TRADING_ENGINE.SECURITIES.GRID.DESCRIPTION')}
            render={({ description }: Security) => (
              <div className="TradingEngineSecuritiesGrid__cell-primary">
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
            render={({ symbols = [] }: Security) => (
              <div className="TradingEngineSecuritiesGrid__cell-primary">
                <Choose>
                  <When condition={!!symbols?.length}>
                    {symbols?.join(', ')}
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
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    newSecurityModal: NewSecurityModal,
    editSecurityModal: EditSecurityModal,
  }),
)(TradingEngineSecuritiesGrid);
