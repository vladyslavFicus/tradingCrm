import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { NetworkStatus } from 'apollo-client';
import PropTypes from 'constants/propTypes';
import ClientsGrid from './components/ClientsGrid';
import ClientsGridFilter from './components/ClientsGridFilter';
import ClientsHeader from './components/ClientsHeader';
import ClientsQuery from './graphql/ClientsQuery';
import './ClientsList.scss';

class ClientsList extends PureComponent {
  static propTypes = {
    clientsQuery: PropTypes.query({
      profiles: PropTypes.pageable(PropTypes.profileView),
    }).isRequired,
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
    const { clientsQuery } = this.props;
    const { select } = this.state;

    return (
      <div className="ClientsList">
        <ClientsHeader
          clientsQuery={clientsQuery}
          select={select}
        />

        <ClientsGridFilter
          clientsLoading={clientsQuery.loading}
          handleRefetch={clientsQuery.refetch}
        />

        <ClientsGrid
          clientsQuery={clientsQuery}
          onSelect={this.onSelect}
        />
      </div>
    );
  }
}

export default compose(
  withRequests({
    clientsQuery: ClientsQuery,
  }),
)(ClientsList);
