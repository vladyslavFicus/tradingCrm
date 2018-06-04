import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import PendingPayouts from './PendingPayouts';
import { withNotifications, withModals } from '../../../../../../../components/HighOrder';
import { pendingPayoutsQuery } from '../../../../../../../graphql/queries/rewardPlan';
import { pendingPayoutsMutation } from '../../../../../../../graphql/mutations/rewardPlan';
import RewardPlanModal from '../../RewardPlanModal';
import { getBrandId } from '../../../../../../../config';
import { isDwhApiEnableQuery } from '../../../../../../../graphql/queries/options';

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
  graphql(pendingPayoutsQuery, {
    name: 'pendingPayouts',
    options: ({ playerUUID }) => ({
      variables: {
        playerUUID,
      },
    }),
    skip: ({ isDwhApiEnable }) => !get(isDwhApiEnable, 'options.signUp.isDwhApiEnable', false),
  }),
  graphql(pendingPayoutsMutation, {
    name: 'pendingPayoutsMutation',
  }),
  withNotifications,
)(PendingPayouts);
