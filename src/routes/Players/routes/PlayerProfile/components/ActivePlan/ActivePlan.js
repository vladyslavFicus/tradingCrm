import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import RewardPlan from '../RewardPlan';
import PropTypes from '../../../../../../constants/propTypes';
import {
  types,
  typesKeys,
  modalStaticData,
} from '../../../../../../constants/rewardPlan';

class ActivePlan extends Component {
  static propTypes = {
    modals: PropTypes.shape({
      rewardPlanModal: PropTypes.modalType,
    }).isRequired,
    activeRewardPlan: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      rewardPlan: PropTypes.shape({
        data: PropTypes.shape({
          lottery: PropTypes.rewardPlanAmount,
        }),
      }),
    }),
  };
  static defaultProps = {
    activeRewardPlan: {},
  };

  handleOpenUpdateAmountModal = () => {
    const {
      activeRewardPlan,
      modals: { rewardPlanModal },
    } = this.props;

    const rewardPlan = get(activeRewardPlan, `rewardPlan.data.${typesKeys[types.LOTTERY]}`);

    rewardPlanModal.show({
      onSubmit: this.handleChangePlan,
      initialValues: {
        amount: rewardPlan.amount,
        isActive: rewardPlan.isActive,
      },
      modalStaticData: modalStaticData[types.LOTTERY],
    });
  };

  handleChangePlan = async (formData) => {
    const {
      modals: { rewardPlanModal },
      lotteryMutation,
      notify,
      match: {
        params: {
          id: playerUUID,
        },
      },
    } = this.props;

    const action = await lotteryMutation({
      variables: {
        ...formData,
        type: typesKeys[types.LOTTERY],
        [typesKeys[types.LOTTERY]]: true,
        playerUUID,
      },
    });

    const error = get(action, 'data.rewardPlan.update.error');

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
    } = this.props;

    const amount = get(activeRewardPlan, 'rewardPlan.data.lottery.amount');
    const available = get(activeRewardPlan, 'rewardPlan.data.userId', false);

    return (
      <div className="header-block">
        <div className="header-block-title">
          {I18n.t('PLAYER_PROFILE.PROFILE.ACTIVE_PLAN.TITLE')}
        </div>
        <If condition={!loading}>
          <RewardPlan
            title="Lottery tickets"
            available={available}
            amount={amount}
            onOpen={this.handleOpenUpdateAmountModal}
          />
        </If>
      </div>
    );
  }
}

export default ActivePlan;
