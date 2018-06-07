import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import ActivePlan from './ActivePlan';
import { withNotifications, withModals } from '../../../../../../components/HighOrder';
import { activePlanQuery } from '../../../../../../graphql/queries/rewardPlan';
import { lotteryMutation } from '../../../../../../graphql/mutations/rewardPlan';
import RewardPlanModal from '../RewardPlanModal';
import { servicesQuery } from '../../../../../../graphql/queries/options';

export default compose(
  withRouter,
  withModals({
    rewardPlanModal: RewardPlanModal,
  }),
  graphql(servicesQuery, {
    name: 'optionServices',
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
    skip: ({ playerUUID, optionServices }) => (
      !playerUUID ||
      optionServices.loading ||
      get(optionServices, 'options.services', []).indexOf('dwh') === -1
    ),
  }),
  graphql(lotteryMutation, {
    name: 'lotteryMutation',
  }),
  withNotifications,
)(ActivePlan);
