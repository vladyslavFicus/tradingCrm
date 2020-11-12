import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
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
    allRowsSelected: false,
    touchedRowsIds: [],
  };

  componentDidUpdate(prevProps) {
    // Clear selecting when filters or sorting changed
    if (this.props.leadsQuery.loading && !prevProps.leadsQuery.loading) {
      this.updateLeadsListState();
    }
  }

  updateLeadsListState = (
    allRowsSelected = false,
    touchedRowsIds = [],
  ) => {
    this.setState({ allRowsSelected, touchedRowsIds });
  };

  render() {
    const { leadsQuery } = this.props;
    const { allRowsSelected, touchedRowsIds } = this.state;

    return (
      <div className="LeadsList">
        <LeadsHeader
          leadsQuery={leadsQuery}
          touchedRowsIds={touchedRowsIds}
          allRowsSelected={allRowsSelected}
          updateLeadsListState={this.updateLeadsListState}
        />

        <LeadsGridFilter handleRefetch={leadsQuery.refetch} />

        <LeadsGrid
          leadsQuery={leadsQuery}
          touchedRowsIds={touchedRowsIds}
          allRowsSelected={allRowsSelected}
          updateLeadsListState={this.updateLeadsListState}
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
