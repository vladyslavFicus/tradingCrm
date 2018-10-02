import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ActivePlan from './ActivePlan';
import { withNotifications, withModals } from '../../../../../../components/HighOrder';
import { activePlanQuery } from '../../../../../../graphql/queries/rewardPlan';
import { activePlanMutation } from '../../../../../../graphql/mutations/rewardPlan';
import RewardPlanModal from '../RewardPlanModal';

const mapStateToProps = ({
  profile: { profile },
  options: { data: { baseCurrency } },
  auth: { brandId },
}) => ({
  brandId,
  currency: profile.data.currencyCode || baseCurrency,
});

export default compose(
  withRouter,
  withModals({
    rewardPlanModal: RewardPlanModal,
  }),
  connect(mapStateToProps),
  graphql(activePlanQuery, {
    name: 'activeRewardPlan',
    options: ({ match: { params: { id: playerUUID } }, brandId }) => ({
      variables: {
        playerUUID,
        brandId,
      },
    }),
  }),
  graphql(activePlanMutation, {
    name: 'activePlanMutation',
  }),
  withNotifications,
)(ActivePlan);
