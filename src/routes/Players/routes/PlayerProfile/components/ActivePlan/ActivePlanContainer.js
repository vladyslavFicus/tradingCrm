import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import ActivePlan from './ActivePlan';
import { withNotifications, withModals } from '../../../../../../components/HighOrder';
import { activePlanQuery } from '../../../../../../graphql/queries/rewardPlan';
import { lotteryMutation } from '../../../../../../graphql/mutations/rewardPlan';
import RewardPlanModal from '../RewardPlanModal';

export default compose(
  withRouter,
  withModals({
    rewardPlanModal: RewardPlanModal,
  }),
  graphql(activePlanQuery, {
    name: 'activeRewardPlan',
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      variables: {
        playerUUID,
      },
    }),
  }),
  graphql(lotteryMutation, {
    name: 'lotteryMutation',
  }),
  withNotifications,
)(ActivePlan);
