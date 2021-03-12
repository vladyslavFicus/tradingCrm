import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { NetworkStatus } from 'apollo-client';
import PropTypes from 'constants/propTypes';
import LeadsHeader from './components/LeadsHeader';
import LeadsGridFilter from './components/LeadsGridFilter';
import LeadsGrid from './components/LeadsGrid';
import getLeadsQuery from './graphql/getLeadsQuery';
import './LeadsList.scss';

class LeadsList extends PureComponent {
  static propTypes = {
    leadsQuery: PropTypes.query({
      leads: PropTypes.pageable(PropTypes.lead),
    }).isRequired,
  };

  state = {
    select: null,
  };

  componentDidUpdate(prevProps) {
    const { leadsQuery } = this.props;
    const { select } = this.state;

    // Clear selecting when filters or sorting changed
    if (leadsQuery.networkStatus === NetworkStatus.setVariables && !prevProps.leadsQuery.loading && select) {
      select.reset();
    }
  }

  onSelect = (select) => {
    this.setState({ select });
  };

  render() {
    const { leadsQuery } = this.props;
    const { select } = this.state;

    return (
      <div className="LeadsList">
        <LeadsHeader
          leadsQuery={leadsQuery}
          select={select}
        />

        <LeadsGridFilter handleRefetch={leadsQuery.refetch} />

        <LeadsGrid
          leadsQuery={leadsQuery}
          onSelect={this.onSelect}
        />
      </div>
    );
  }
}

export default compose(
  withRequests({
    leadsQuery: getLeadsQuery,
  }),
)(LeadsList);
