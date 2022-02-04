import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import OperatorFeedsFilterForm from './components/DistributionRuleFeedsFilterForm';
import OperatorFeedsList from './components/DistributionRuleFeedsList';
import FeedsQuery from './graphql/FeedsQuery';
import './DistributionRuleFeedsTab.scss';

class DistributionRuleFeedsTab extends PureComponent {
  static propTypes = {
    feedsQuery: PropTypes.query({
      feeds: PropTypes.pageable(PropTypes.feed),
    }).isRequired,
  };

  render() {
    const { feedsQuery } = this.props;

    return (
      <div className="DistributionRuleFeedsTab">
        <OperatorFeedsFilterForm handleRefetch={feedsQuery.refetch} />
        <OperatorFeedsList feedsQuery={feedsQuery} />
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    feedsQuery: FeedsQuery,
  }),
)(DistributionRuleFeedsTab);
