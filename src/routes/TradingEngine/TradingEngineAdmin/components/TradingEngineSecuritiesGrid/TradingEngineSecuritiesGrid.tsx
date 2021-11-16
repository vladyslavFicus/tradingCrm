import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose, QueryResult } from 'react-apollo';
import { withRequests } from 'apollo';
import withModals from 'hoc/withModals';
import { Button } from 'components/UI';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import { Modal } from 'types/trading-engine/modal';
import NewSecuritiesModal from 'routes/TradingEngine/TradingEngineAdmin/modals/NewSecuritiesModal';
import { tradingEngineAdminTabs } from '../../constants';
import TradingEngineSecuritiesQuery from './graphql/TradingEngineSecuritiesQuery';
import './TradingEngineSecuritiesGrid.scss';

interface Securities {
  name: string,
  description: string,
  symbols: string[],
}

interface SecuritiesQuery {
  tradingEngineSecurities: Securities[],
}

interface Props {
  securitiesQuery: QueryResult<SecuritiesQuery>,
  modals: {
    newSecuritiesModal: Modal,
  },
}

class TradingEngineSecuritiesGrid extends PureComponent<Props> {
  renderName = ({ name }: Securities) => (
    <div className="TradingEngineSecuritiesGrid__cell-primary">
      <Choose>
        <When condition={!!name}>
          {name}
        </When>
        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    </div>
  );

  renderDescription = ({ description }: Securities) => (
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

  renderSymbol = ({ symbols } : Securities) => (
    <div className="TradingEngineSecuritiesGrid__cell-primary">
      <Choose>
        <When condition={!!symbols}>
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
      securitiesQuery,
      modals: {
        newSecuritiesModal,
      },
    } = this.props;

    newSecuritiesModal.show({
      onSuccess: securitiesQuery.refetch,
    });
  };

  render() {
    const {
      securitiesQuery,
    } = this.props;

    const securities = securitiesQuery.data?.tradingEngineSecurities || [];

    return (
      <div className="card">
        <Tabs items={tradingEngineAdminTabs} />

        <div className="TradingEngineSecuritiesGrid__header card-heading card-heading--is-sticky">
          <span className="TradingEngineSecuritiesGrid__title">
            <strong>{securities.length}</strong>&nbsp;{I18n.t('TRADING_ENGINE.SYMBOLS.HEADLINE')}
          </span>
          <Button
            onClick={this.handleNewSecuritiesClick}
            commonOutline
            small
          >
            {I18n.t('TRADING_ENGINE.SYMBOLS.NEW_SECURITIES')}
          </Button>
        </div>

        <div className="TradingEngineSecuritiesGrid">
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
    newSecuritiesModal: NewSecuritiesModal,
  }),
)(TradingEngineSecuritiesGrid);
