import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import RewardPlan from '../RewardPlan';
import PropTypes from '../../../../../../constants/propTypes';
import {
  types,
  typesTitle,
  modalStaticData,
} from '../../../../../../constants/rewardPlan';
import Amount from '../../../../../../components/Amount';

class ActivePlan extends Component {
  static propTypes = {
    modals: PropTypes.shape({
      rewardPlanModal: PropTypes.modalType,
    }).isRequired,
    activeRewardPlan: PropTypes.shape({
      loading: PropTypes.bool,
      rewardPlan: PropTypes.shape({
        data: PropTypes.object,
      }),
    }),
    currency: PropTypes.string.isRequired,
    activePlanMutation: PropTypes.func.isRequired,
  };
  static defaultProps = {
    activeRewardPlan: {},
  };

  static contextTypes = {
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { registerUpdateCacheListener } = this.context;
    const { activeRewardPlan: { refetch } } = this.props;
    const { name: componentName } = this.constructor;

    registerUpdateCacheListener(componentName, refetch);
  }

  componentWillUnmount() {
    const { unRegisterUpdateCacheListener } = this.context;
    const { name: componentName } = this.constructor;

    unRegisterUpdateCacheListener(componentName);
  }

  handleOpenUpdateAmountModal = () => {
    const {
      activeRewardPlan,
      modals: { rewardPlanModal },
    } = this.props;

    const { amount, type } = get(activeRewardPlan, 'activeRewardPlan.data');

    rewardPlanModal.show({
      onSubmit: this.handleChangePlan(type),
      initialValues: {
        amount,
      },
      modalStaticData: modalStaticData[type],
    });
  };

  handleChangePlan = type => async ({ amount }) => {
    const {
      modals: { rewardPlanModal },
      activePlanMutation,
      notify,
      match: {
        params: {
          id: playerUUID,
        },
      },
    } = this.props;

    const action = await activePlanMutation({
      variables: {
        amount,
        type,
        isActive: true,
        playerUUID,
      },
    });

    const error = get(action, 'data.activeRewardPlan.update.error');

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('PROFILE.REWARD_PLAN.NOTIFICATION.UPDATE_MESSAGE'),
    });

    rewardPlanModal.hide();
  };

  render() {
    const {
      activeRewardPlan,
      activeRewardPlan: {
        loading,
      },
      currency,
    } = this.props;

    const error = get(activeRewardPlan, 'activeRewardPlan.error.error', false);
    const amount = get(activeRewardPlan, 'activeRewardPlan.data.amount', 0);
    const type = get(activeRewardPlan, 'activeRewardPlan.data.type');

    const formatAmount = [types.BONUS, types.CASH_BACKS].includes(type)
      ? <Amount amount={amount} currency={currency} />
      : amount;

    return (
      <div className="header-block">
        <div className="header-block-title">
          {I18n.t('PLAYER_PROFILE.PROFILE.ACTIVE_PLAN.TITLE')}
        </div>
        <Choose>
          <When condition={!error}>
            <If condition={!loading && type}>
              <RewardPlan
                title={typesTitle[type]}
                available
                amount={formatAmount}
                onClick={this.handleOpenUpdateAmountModal}
              />
            </If>
          </When>
          <Otherwise>
            <div className="header-block-middle">
              {I18n.t('COMMON.NOT_AVAILABLE')}
            </div>
          </Otherwise>
        </Choose>
      </div>
    );
  }
}

export default ActivePlan;
