import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../../../../constants/propTypes';
import RewardPlan from '../../RewardPlan';
import Amount from '../../../../../../../components/Amount';
import {
  types,
  typesTitle,
  modalStaticData,
  pendingPayoutsTypes,
} from '../../../../../../../constants/rewardPlan';
import { services } from '../../../../../../../constants/services';

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
    optionServices: PropTypes.shape({
      options: PropTypes.shape({
        services: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
    currency: PropTypes.string.isRequired,
  };
  static defaultProps = {
    pendingPayouts: {},
    optionServices: {},
  };

  handleOpenUpdateAmountModal = type => () => {
    const {
      pendingPayouts,
      modals: {
        rewardPlanModal,
      },
    } = this.props;

    const rewardPlan = get(pendingPayouts, `rewardPlan.data.${type}`);

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
      includeParams[key] = false;
    });

    includeParams[type] = true;

    const action = await pendingPayoutsMutation({
      variables: {
        ...formData,
        type,
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
      optionServices,
      currency,
    } = this.props;

    const dwhApiEnable = get(optionServices, 'options.services', []).indexOf(services.dwh) > -1;

    if (!dwhApiEnable) {
      return false;
    }

    const bonusAmount = get(pendingPayouts, `rewardPlan.data.${types.BONUS}.amount`, 0);
    const runesAmount = get(pendingPayouts, `rewardPlan.data.${types.RUNES}.amount`, 0);
    const cashBacksAmount = get(pendingPayouts, `rewardPlan.data.${types.CASH_BACKS}.amount`, 0);
    const freeSpinsAmount = get(pendingPayouts, `rewardPlan.data.${types.FREE_SPINS}.amount`, 0);
    const available = !!get(pendingPayouts, 'rewardPlan.data.userId', false);

    return (
      <div className="col-md-2">
        <div className="account-details__label">
          {I18n.t('PLAYER_PROFILE.PROFILE.PENDING_PAYOUTS.TITLE')}
        </div>
        <div className="card">
          <If condition={!loading}>
            <div className="card-body">
              <RewardPlan
                title={I18n.t(typesTitle.bonus)}
                available={available}
                amount={<Amount amount={bonusAmount} currency={currency} />}
                onClick={this.handleOpenUpdateAmountModal(types.BONUS)}
              />
              <RewardPlan
                title={I18n.t(typesTitle.cashBacks)}
                available={available}
                amount={<Amount amount={cashBacksAmount} currency={currency} />}
                onClick={this.handleOpenUpdateAmountModal(types.CASH_BACKS)}
              />
              <RewardPlan
                title={I18n.t(typesTitle.freeSpins)}
                available={available}
                amount={freeSpinsAmount}
                onClick={this.handleOpenUpdateAmountModal(types.FREE_SPINS)}
              />
              <RewardPlan
                title={I18n.t(typesTitle.runes)}
                available={available}
                amount={runesAmount}
                onClick={this.handleOpenUpdateAmountModal(types.RUNES)}
              />
            </div>
          </If>
        </div>
      </div>
    );
  }
}

export default PendingPayouts;
