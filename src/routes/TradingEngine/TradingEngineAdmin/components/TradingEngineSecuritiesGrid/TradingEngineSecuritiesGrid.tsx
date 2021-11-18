import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { QueryResult } from 'react-apollo';
import { withRequests } from 'apollo';
import withModals from 'hoc/withModals';
import { Button } from 'components/UI';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import { Modal } from 'types/modal';
import EditSecurityModal from 'routes/TradingEngine/TradingEngineAdmin/modals/EditSecurityModal';
import NewSecurityModal from 'routes/TradingEngine/TradingEngineAdmin/modals/NewSecurityModal';
import { tradingEngineAdminTabs } from '../../constants';
import TradingEngineSecuritiesQuery from './graphql/TradingEngineSecuritiesQuery';
import './TradingEngineSecuritiesGrid.scss';

interface Security {
  name: string,
  description: string,
  symbols: string[],
}

interface SecuritiesData {
  tradingEngineSecurities: Security[],
}

interface Props {
  securitiesQuery: QueryResult<SecuritiesData>,
  modals: {
    newSecurityModal: Modal,
    editSecurityModal: Modal,
  },
}

class TradingEngineSecuritiesGrid extends PureComponent<Props> {
  refetchSecurities = () => this.props.securitiesQuery.refetch();

  renderName = ({ name }: Security) => (
    <div
      className="TradingEngineSecuritiesGrid__cell-primary"
      onClick={() => this.props.modals.editSecurityModal.show({
        name,
        onSuccess: this.refetchSecurities,
      })}
    >
      {name}
    </div>
  );

  renderDescription = ({ description }: Security) => (
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
  );

  renderSymbol = ({ symbols } : Security) => (
    <div className="TradingEngineSecuritiesGrid__cell-primary">
      <Choose>
        <When condition={!!symbols.length}>
          {symbols.join(', ')}
        </When>
        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    </div>
  );

  handleNewSecuritiesClick = () => {
    const {
      modals: {
        newSecurityModal,
      },
    } = this.props;

    newSecurityModal.show({
      onSuccess: this.refetchSecurities,
    });
  };

  render() {
    const {
      securitiesQuery,
    } = this.props;

    const securities = securitiesQuery.data?.tradingEngineSecurities || [];

    return (
      <div className="TradingEngineSecuritiesGrid">
        <Tabs items={tradingEngineAdminTabs} />

        <div className="TradingEngineSecuritiesGrid__header">
          <span className="TradingEngineSecuritiesGrid__title">
            <strong>{securities.length}</strong>&nbsp;{I18n.t('TRADING_ENGINE.SYMBOLS.HEADLINE')}
          </span>
          <Button
            onClick={this.handleNewSecuritiesClick}
            commonOutline
            small
          >
            {I18n.t('TRADING_ENGINE.SYMBOLS.NEW_SECURITY')}
          </Button>
        </div>

        <div className="TradingEngineSecuritiesGrid__card">
          <Table
            items={securities}
            loading={securitiesQuery.loading}
          >
            <Column
              width={200}
              header={I18n.t('TRADING_ENGINE.SECURITIES.GRID.NAME')}
              render={this.renderName}
            />
            <Column
              width={400}
              header={I18n.t('TRADING_ENGINE.SECURITIES.GRID.DESCRIPTION')}
              render={this.renderDescription}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.SECURITIES.GRID.SYMBOLS')}
              render={this.renderSymbol}
            />
          </Table>
        </div>
      </div>
    );
  }
}

export default compose(
  withRequests({
    securitiesQuery: TradingEngineSecuritiesQuery,
  }),
  withModals({
    newSecurityModal: NewSecurityModal,
    editSecurityModal: EditSecurityModal,
  }),
)(TradingEngineSecuritiesGrid);
