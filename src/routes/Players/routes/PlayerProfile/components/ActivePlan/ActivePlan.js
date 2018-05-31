import React, { Component } from 'react';
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

  handleOpenChangeModal = () => {
    const {
      activeRewardPlan,
      modals: { rewardPlanModal },
    } = this.props;

    const amount = get(activeRewardPlan, `rewardPlan.data.${typesKeys[types.LOTTERY]}.amount`, 0);

    rewardPlanModal.show({
      onSubmit: this.handleChangePlan,
      initialValues: {
        amount,
      },
      modalStaticData: modalStaticData[types.LOTTERY],
    });
  };

  handleChangePlan = async ({ amount }) => {
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
        amount,
        playerUUID,
      },
    });

    const error = get(action, 'data.rewardPlan.update.error');

    notify({
      level: error ? 'error' : 'success',
      title: 'Change lottery tickets',
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
        <div className="header-block-title">Active plan</div>
        <If condition={!loading}>
          <RewardPlan
            title="Lottery tickets"
            available={available}
            amount={amount}
            onOpen={this.handleOpenChangeModal}
          />
        </If>
      </div>
    );
  }
}

export default ActivePlan;
