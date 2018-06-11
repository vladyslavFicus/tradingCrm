import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import PendingPayouts from './PendingPayouts';
import { withNotifications, withModals } from '../../../../../../../components/HighOrder';
import { pendingPayoutsQuery } from '../../../../../../../graphql/queries/rewardPlan';
import { pendingPayoutsMutation } from '../../../../../../../graphql/mutations/rewardPlan';
import RewardPlanModal from '../../RewardPlanModal';
import { servicesQuery } from '../../../../../../../graphql/queries/options';

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
  graphql(servicesQuery, {
    name: 'optionServices',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(pendingPayoutsQuery, {
    name: 'pendingPayouts',
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
  graphql(pendingPayoutsMutation, {
    name: 'pendingPayoutsMutation',
  }),
  withNotifications,
)(PendingPayouts);
