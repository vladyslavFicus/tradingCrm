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
    allRowsSelected: false,
    touchedRowsIds: [],
  };

  componentDidUpdate(prevProps) {
    // Clear selecting when filters or sorting changed
    if (this.props.clientsQuery.networkStatus === NetworkStatus.setVariables && !prevProps.clientsQuery.loading) {
      this.updateClientsListState();
    }
  }

  updateClientsListState = (
    allRowsSelected = false,
    touchedRowsIds = [],
  ) => {
    this.setState({ allRowsSelected, touchedRowsIds });
  };

  render() {
    const { clientsQuery } = this.props;
    const { allRowsSelected, touchedRowsIds } = this.state;

    return (
      <div className="ClientsList">
        <ClientsHeader
          clientsQuery={clientsQuery}
          touchedRowsIds={touchedRowsIds}
          allRowsSelected={allRowsSelected}
          updateClientsListState={this.updateClientsListState}
        />

        <ClientsGridFilter
          clientsLoading={clientsQuery.loading}
          handleRefetch={clientsQuery.refetch}
        />

        <ClientsGrid
          clientsQuery={clientsQuery}
          touchedRowsIds={touchedRowsIds}
          allRowsSelected={allRowsSelected}
          updateClientsListState={this.updateClientsListState}
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
