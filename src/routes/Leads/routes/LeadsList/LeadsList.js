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
    leadsData: PropTypes.query({
      leads: PropTypes.pageable(PropTypes.lead),
    }).isRequired,
  };

  state = {
    allRowsSelected: false,
    touchedRowsIds: [],
  };

  updateLeadsListState = (
    allRowsSelected = false,
    touchedRowsIds = [],
  ) => {
    this.setState({ allRowsSelected, touchedRowsIds });
  };

  render() {
    const { leadsData } = this.props;
    const { allRowsSelected, touchedRowsIds } = this.state;

    return (
      <div className="LeadsList">
        <LeadsHeader
          leadsData={leadsData}
          touchedRowsIds={touchedRowsIds}
          allRowsSelected={allRowsSelected}
          updateLeadsListState={this.updateLeadsListState}
        />

        <LeadsGridFilter />

        <LeadsGrid
          leadsData={leadsData}
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
    leadsData: getLeadsQuery,
  }),
)(LeadsList);
