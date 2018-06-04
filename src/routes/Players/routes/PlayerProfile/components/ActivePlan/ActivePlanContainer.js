import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import ActivePlan from './ActivePlan';
import { withNotifications, withModals } from '../../../../../../components/HighOrder';
import { activePlanQuery } from '../../../../../../graphql/queries/rewardPlan';
import { lotteryMutation } from '../../../../../../graphql/mutations/rewardPlan';
import RewardPlanModal from '../RewardPlanModal';
import { getBrandId } from '../../../../../../config';
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
      variables: {
        brandId: getBrandId(),
      },
    },
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
    skip: ({ isDwhApiEnable }) => !get(isDwhApiEnable, 'options.signUp.isDwhApiEnable', false),
  }),
  graphql(lotteryMutation, {
    name: 'lotteryMutation',
  }),
  withNotifications,
)(ActivePlan);
