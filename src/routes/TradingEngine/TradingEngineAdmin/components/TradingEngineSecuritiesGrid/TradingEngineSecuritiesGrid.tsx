import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import { tradingEngineAdminTabs } from '../../constants';
import TradingEngineSecuritiesQuery from './graphql/TradingEngineSecuritiesQuery';
import './TradingEngineSecuritiesGrid.scss';

interface Props {
  securitiesQuery: {
    loading: boolean,
    data: {
      tradingEngineSecurities: {
        name: string,
        description: string,
        symbols: string[],
      }[],
    },
  },
}

class TradingEngineSecuritiesGrid extends PureComponent<Props> {
  renderName = ({ name }: { name: string}) => (
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

  renderDescription = ({ description }: { description: string }) => (
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

  renderSymbol = ({ symbols } : { symbols: [] }) => (
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

  render() {
    const {
      securitiesQuery,
    } = this.props;

    const securities = securitiesQuery.data?.tradingEngineSecurities || [];

    return (
      <div className="card">
        <Tabs items={tradingEngineAdminTabs} />

        <div className="card-heading card-heading--is-sticky">
          <span className="TradingEngineSecuritiesGrid__title">
            <strong>{securities.length}</strong>&nbsp;{I18n.t('TRADING_ENGINE.SYMBOLS.HEADLINE')}
          </span>
        </div>

        <div className="TradingEngineSecuritiesGrid">
          <Table
            items={securities}
            loading={securitiesQuery.loading}
          >
            <Column
              header={I18n.t('TRADING_ENGINE.SECURITIES.GRID.NAME')}
              render={this.renderName}
            />
            <Column
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
)(TradingEngineSecuritiesGrid);
