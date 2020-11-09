import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import LeadFeedsFilterForm from './components/LeadFeedsFilterForm';
import LeadFeedsList from './components/LeadFeedsList';
import FeedsQuery from './graphql/FeedsQuery';
import './LeadFeedsTab.scss';

class LeadFeedsTab extends PureComponent {
  static propTypes = {
    feedsQuery: PropTypes.query({
      feeds: PropTypes.pageable(PropTypes.feed),
    }).isRequired,
  };

  render() {
    const { feedsQuery } = this.props;

    return (
      <div className="LeadFeedsTab">
        <div className="LeadFeedsTab__header">
          <div className="LeadFeedsTab__title">
            {I18n.t('LEAD_PROFILE.FEED.TITLE')}
          </div>
        </div>

        <LeadFeedsFilterForm handleRefetch={feedsQuery.refetch} />
        <LeadFeedsList feedsQuery={feedsQuery} />
      </div>
    );
  }
}


export default compose(
  withRouter,
  withRequests({
    feedsQuery: FeedsQuery,
  }),
)(LeadFeedsTab);
