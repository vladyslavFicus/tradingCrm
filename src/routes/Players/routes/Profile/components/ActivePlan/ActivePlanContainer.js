import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import ActivePlan from './ActivePlan';
import { withNotifications, withModals } from '../../../../../../components/HighOrder';
import { activePlanQuery } from '../../../../../../graphql/queries/rewardPlan';
import { activePlanMutation } from '../../../../../../graphql/mutations/rewardPlan';
import RewardPlanModal from '../RewardPlanModal';
import { servicesQuery } from '../../../../../../graphql/queries/options';

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
  graphql(activePlanMutation, {
    name: 'activePlanMutation',
  }),
  withNotifications,
)(ActivePlan);
