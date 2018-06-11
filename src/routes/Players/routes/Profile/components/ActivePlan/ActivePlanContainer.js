import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import ActivePlan from './ActivePlan';
import { withNotifications, withModals } from '../../../../../../components/HighOrder';
import { activePlanQuery } from '../../../../../../graphql/queries/rewardPlan';
import { lotteryMutation } from '../../../../../../graphql/mutations/rewardPlan';
import RewardPlanModal from '../RewardPlanModal';
import { isDwhApiEnableQuery } from '../../../../../../graphql/queries/options';

export default compose(
  withRouter,
  withModals({
    rewardPlanModal: RewardPlanModal,
  }),
  graphql(isDwhApiEnableQuery, {
    name: 'isDwhApiEnable',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(activePlanQuery, {
    name: 'activeRewardPlan',
    options: ({ playerUUID }) => ({
      variables: {
        playerUUID,
      },
    }),
    skip: ({ isDwhApiEnable, playerUUID }) => (
      !playerUUID || !get(isDwhApiEnable, 'options.services.isDwhApiEnable', false)
    ),
  }),
  graphql(lotteryMutation, {
    name: 'lotteryMutation',
  }),
  withNotifications,
)(ActivePlan);
