import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../../../../constants/propTypes';
import RewardPlan from '../../RewardPlan';
import {
  types,
  typesKeys,
  typesTitle,
  modalStaticData,
  pendingPayoutsTypes,
} from '../../../../../../../constants/rewardPlan';

class PendingPayouts extends Component {
  static propTypes = {
    modals: PropTypes.shape({
      rewardPlanModal: PropTypes.modalType,
    }).isRequired,
    pendingPayoutsMutation: PropTypes.func.isRequired,
    pendingPayouts: PropTypes.shape({
      loading: PropTypes.bool,
      rewardPlan: PropTypes.shape({
        data: PropTypes.shape({
          pendingPayoutsMutation: PropTypes.rewardPlanAmount,
          bonus: PropTypes.rewardPlanAmount,
          cashBacks: PropTypes.rewardPlanAmount,
          runes: PropTypes.rewardPlanAmount,
          freeSpins: PropTypes.rewardPlanAmount,
        }),
      }),
    }),
    isDwhApiEnable: PropTypes.shape({
      options: PropTypes.shape({
        signUp: PropTypes.shape({
          isDwhApiEnable: PropTypes.bool,
        }),
      }),
    }),
  };
  static defaultProps = {
    pendingPayouts: {},
    isDwhApiEnable: {},
  };

  handleOpenUpdateAmountModal = type => () => {
    const {
      pendingPayouts,
      modals: {
        rewardPlanModal,
      },
    } = this.props;

    const rewardPlan = get(pendingPayouts, `rewardPlan.data.${typesKeys[type]}`);

    rewardPlanModal.show({
      onSubmit: this.handleChangePlan(type),
      initialValues: {
        amount: rewardPlan.amount,
        isActive: rewardPlan.isActive,
      },
      modalStaticData: modalStaticData[type],
    });
  };

  handleChangePlan = type => async (formData) => {
    const {
      modals: {
        rewardPlanModal,
      },
      notify,
      match: {
        params: {
          id: playerUUID,
        },
      },
      pendingPayoutsMutation,
    } = this.props;

    const includeParams = {};

    pendingPayoutsTypes.forEach((key) => {
      includeParams[typesKeys[key]] = false;
    });

    includeParams[typesKeys[type]] = true;

    const action = await pendingPayoutsMutation({
      variables: {
        ...formData,
        type: typesKeys[type],
        ...includeParams,
        playerUUID,
      },
    });

    const error = get(action, 'data.rewardPlan.update.error');
    const userId = get(action, 'data.rewardPlan.update.data.userId');

    notify({
      level: userId && !error ? 'success' : 'error',
      title: I18n.t('PROFILE.REWARD_PLAN.NOTIFICATION.UPDATE_MESSAGE'),
    });

    rewardPlanModal.hide();
  };

  render() {
    const {
      pendingPayouts,
      pendingPayouts: {
        loading,
      },
      isDwhApiEnable,
    } = this.props;

    const dwhApiEnable = get(isDwhApiEnable, 'options.signUp.isDwhApiEnable', false);

    if (!dwhApiEnable) {
      return false;
    }

    const bonusAmount = get(pendingPayouts, `rewardPlan.data.${typesKeys[types.BONUS]}.amount`);
    const runesAmount = get(pendingPayouts, `rewardPlan.data.${typesKeys[types.RUNES]}.amount`);
    const cashBacksAmount = get(pendingPayouts, `rewardPlan.data.${typesKeys[types.CASH_BACKS]}.amount`);
    const freeSpinsAmount = get(pendingPayouts, `rewardPlan.data.${typesKeys[types.FREE_SPINS]}.amount`);
    const available = get(pendingPayouts, 'rewardPlan.data.userId');

    return (
      <div className="col-md-2">
        <div className="account-details__label">
          {I18n.t('PLAYER_PROFILE.PROFILE.PENDING_PAYOUTS.TITLE')}
        </div>
        <div className="card">
          <If condition={!loading}>
            <div className="card-body">
              <RewardPlan
                title={I18n.t(typesTitle.BONUS)}
                available={available}
                amount={bonusAmount}
                onOpen={this.handleOpenUpdateAmountModal(types.BONUS)}
              />
              <RewardPlan
                title={I18n.t(typesTitle.CASH_BACKS)}
                available={available}
                amount={cashBacksAmount}
                onOpen={this.handleOpenUpdateAmountModal(types.CASH_BACKS)}
              />
              <RewardPlan
                title={I18n.t(typesTitle.FREE_SPINS)}
                available={available}
                amount={freeSpinsAmount}
                onOpen={this.handleOpenUpdateAmountModal(types.FREE_SPINS)}
              />
              <RewardPlan
                title={I18n.t(typesTitle.RUNES)}
                available={available}
                amount={runesAmount}
                onOpen={this.handleOpenUpdateAmountModal(types.RUNES)}
              />
            </div>
          </If>
        </div>
      </div>
    );
  }
}

export default PendingPayouts;
