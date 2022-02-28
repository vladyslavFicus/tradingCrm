import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import PartnerFeedsFilterForm from './components/PartnerFeedsFilterForm';
import PartnerFeedsList from './components/PartnerFeedsList';
import FeedsQuery from './graphql/FeedsQuery';
import './PartnerFeedsTab.scss';

class PartnerFeedsTab extends PureComponent {
  static propTypes = {
    feedsQuery: PropTypes.query({
      feeds: PropTypes.pageable(PropTypes.feed),
    }).isRequired,
  };

  render() {
    const { feedsQuery } = this.props;

    return (
      <div className="PartnerFeedsTab">
        <div className="PartnerFeedsTab__header">
          <div className="PartnerFeedsTab__title">
            {I18n.t('PARTNER_PROFILE.FEED.TITLE')}
          </div>
        </div>

        <PartnerFeedsFilterForm handleRefetch={feedsQuery.refetch} />
        <PartnerFeedsList feedsQuery={feedsQuery} />
      </div>
    );
  }
}


export default compose(
  withRouter,
  withRequests({
    feedsQuery: FeedsQuery,
  }),
)(PartnerFeedsTab);
