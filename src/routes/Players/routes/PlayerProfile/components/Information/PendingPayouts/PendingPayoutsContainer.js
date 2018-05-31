import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import PendingPayouts from './PendingPayouts';
import { withNotifications, withModals } from '../../../../../../../components/HighOrder';
import { pendingPayoutsQuery } from '../../../../../../../graphql/queries/rewardPlan';
import {
  bonusMutation, runesMutation, freeSpinsMutation, cashBacksMutation,
} from '../../../../../../../graphql/mutations/rewardPlan';
import RewardPlanModal from '../../RewardPlanModal';

export default compose(
  withRouter,
  withModals({
    rewardPlanModal: RewardPlanModal,
  }),
  graphql(pendingPayoutsQuery, {
    name: 'pendingPayouts',
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
  graphql(bonusMutation, {
    name: 'bonusMutation',
  }),
  graphql(runesMutation, {
    name: 'runesMutation',
  }),
  graphql(freeSpinsMutation, {
    name: 'freeSpinsMutation',
  }),
  graphql(cashBacksMutation, {
    name: 'cashBacksMutation',
  }),
  withNotifications,
)(PendingPayouts);
