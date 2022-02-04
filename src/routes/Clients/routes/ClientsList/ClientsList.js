import React, { PureComponent } from 'react';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { NetworkStatus } from '@apollo/client';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import ClientsGrid from './components/ClientsGrid';
import ClientsGridFilter from './components/ClientsGridFilter';
import ClientsGridOldFilter from './components/ClientsGridOldFilter';
import ClientsHeader from './components/ClientsHeader';
import ClientsQuery from './graphql/ClientsQuery';
import './ClientsList.scss';

class ClientsList extends PureComponent {
  static propTypes = {
    clientsQuery: PropTypes.query({
      profiles: PropTypes.pageable(PropTypes.profileView),
    }).isRequired,
    isOldClientsGridFilterPanel: PropTypes.bool,
  };

  static defaultProps = {
    isOldClientsGridFilterPanel: false,
  };

  state = {
    select: null,
  };

  componentDidUpdate(prevProps) {
    const { clientsQuery } = this.props;
    const { select } = this.state;

    // Clear selecting when filters or sorting changed
    if (clientsQuery.networkStatus === NetworkStatus.setVariables && !prevProps.clientsQuery.loading && select) {
      select.reset();
    }
  }

  onSelect = (select) => {
    this.setState({ select });
  };

  render() {
    const { clientsQuery, isOldClientsGridFilterPanel } = this.props;
    const { select } = this.state;

    return (
      <div className="ClientsList">
        <ClientsHeader
          clientsQuery={clientsQuery}
          select={select}
        />

        <Choose>
          <When condition={isOldClientsGridFilterPanel}>
            <ClientsGridOldFilter
              clientsLoading={clientsQuery.loading}
              handleRefetch={clientsQuery.refetch}
            />
          </When>
          <Otherwise>
            <ClientsGridFilter
              clientsLoading={clientsQuery.loading}
              handleRefetch={clientsQuery.refetch}
            />
          </Otherwise>
        </Choose>

        <ClientsGrid
          clientsQuery={clientsQuery}
          onSelect={this.onSelect}
        />
      </div>
    );
  }
}

export default compose(
  withStorage(['isOldClientsGridFilterPanel']),
  withRequests({
    clientsQuery: ClientsQuery,
  }),
)(ClientsList);
