import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import OperatorFeedsFilterForm from './components/OperatorFeedsFilterForm';
import OperatorFeedsList from './components/OperatorFeedsList';
import FeedsQuery from './graphql/FeedsQuery';
import './OperatorFeedsTab.scss';

class OperatorFeedsTab extends PureComponent {
  static propTypes = {
    feedsQuery: PropTypes.query({
      feeds: PropTypes.pageable(PropTypes.feed),
    }).isRequired,
  };

  render() {
    const { feedsQuery } = this.props;

    return (
      <div className="OperatorFeedsTab">
        <div className="OperatorFeedsTab__header">
          <div className="OperatorFeedsTab__title">
            {I18n.t('OPERATOR_PROFILE.FEED.TITLE')}
          </div>
        </div>

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
)(OperatorFeedsTab);
