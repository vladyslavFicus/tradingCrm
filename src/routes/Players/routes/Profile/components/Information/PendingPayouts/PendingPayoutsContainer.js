import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import PendingPayouts from './PendingPayouts';
import { withNotifications, withModals } from '../../../../../../../components/HighOrder';
import { pendingPayoutsQuery } from '../../../../../../../graphql/queries/rewardPlan';
import { pendingPlanMutation } from '../../../../../../../graphql/mutations/rewardPlan';
import RewardPlanModal from '../../RewardPlanModal';

const mapStateToProps = ({
  profile: { profile },
  options: { data: { baseCurrency } },
}) => ({
  currency: profile.data.currencyCode || baseCurrency,
});

export default compose(
  withRouter,
  withModals({
    rewardPlanModal: RewardPlanModal,
  }),
  connect(mapStateToProps),
  graphql(pendingPayoutsQuery, {
    name: 'pendingPayouts',
    options: ({ match: { params: { id: playerUUID } } }) => ({
      variables: {
        playerUUID,
      },
    }),
  }),
  graphql(pendingPlanMutation, {
    name: 'pendingPlanMutation',
  }),
  withNotifications,
)(PendingPayouts);
