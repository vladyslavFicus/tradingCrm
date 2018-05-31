import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../../../../constants/propTypes';
import RewardPlan from '../../RewardPlan';
import {
  types,
  typesKeys,
  typesTitle,
  modalStaticData,
} from '../../../../../../../constants/rewardPlan';

class PendingPayouts extends Component {
  static propTypes = {
    modals: PropTypes.shape({
      rewardPlanModal: PropTypes.modalType,
    }).isRequired,
    pendingPayouts: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      rewardPlan: PropTypes.shape({
        data: PropTypes.shape({
          bonus: PropTypes.rewardPlanAmount,
          cashBacks: PropTypes.rewardPlanAmount,
          runes: PropTypes.rewardPlanAmount,
          freeSpins: PropTypes.rewardPlanAmount,
        }),
      }),
    }),
  };
  static defaultProps = {
    pendingPayouts: {},
  };

  handleOpenChangeModal = type => () => {
    const {
      pendingPayouts,
      modals: {
        rewardPlanModal,
      },
    } = this.props;

    const amount = get(pendingPayouts, `rewardPlan.data.${typesKeys[type]}.amount`, 0);

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
      bonusMutation,
      cashBacksMutation,
      freeSpinsMutation,
      runesMutation,
      modals: {
        rewardPlanModal,
      },
      notify,
      match: {
        params: {
          id: playerUUID,
        },
      },
    } = this.props;

    const variables = {
      amount,
      playerUUID,
    };

    let action = {};

    switch (type) {
      case types.BONUS:
        action = await bonusMutation({ variables });
        break;
      case types.CASH_BACKS:
        action = await cashBacksMutation({ variables });
        break;
      case types.FREE_SPINS:
        action = await freeSpinsMutation({ variables });
        break;
      case types.RUNES:
        action = await runesMutation({ variables });
        break;
      default:
        break;
    }

    const error = get(action, 'data.rewardPlan.update.error');
    const userId = get(action, 'data.rewardPlan.update.data.userId');

    notify({
      level: userId && !error ? 'success' : 'error',
      title: error || !userId ? I18n.t('COMMON.FAIL_UPDATE') : I18n.t('COMMON.SUCCESS_UPDATE'),
    });

    rewardPlanModal.hide();
  };

  render() {
    const {
      pendingPayouts,
      pendingPayouts: {
        loading,
      },
    } = this.props;

    const bonusAmount = get(pendingPayouts, `rewardPlan.data.${typesKeys[types.BONUS]}.amount`);
    const runesAmount = get(pendingPayouts, `rewardPlan.data.${typesKeys[types.RUNES]}.amount`);
    const cashBacksAmount = get(pendingPayouts, `rewardPlan.data.${typesKeys[types.CASH_BACKS]}.amount`);
    const freeSpinsAmount = get(pendingPayouts, `rewardPlan.data.${typesKeys[types.FREE_SPINS]}.amount`);
    const available = get(pendingPayouts, 'rewardPlan.data.userId');

    return (
      <Fragment>
        <div className="account-details__label">PENDING PAYOUTS</div>
        <div className="card">
          <If condition={!loading}>
            <div className="card-body">
              <RewardPlan
                title={I18n.t(typesTitle.BONUS)}
                available={available}
                amount={bonusAmount}
                onOpen={this.handleOpenChangeModal(types.BONUS)}
              />
              <RewardPlan
                title={I18n.t(typesTitle.CASH_BACKS)}
                available={available}
                amount={cashBacksAmount}
                onOpen={this.handleOpenChangeModal(types.CASH_BACKS)}
              />
              <RewardPlan
                title={I18n.t(typesTitle.FREE_SPINS)}
                available={available}
                amount={freeSpinsAmount}
                onOpen={this.handleOpenChangeModal(types.FREE_SPINS)}
              />
              <RewardPlan
                title={I18n.t(typesTitle.RUNES)}
                available={available}
                amount={runesAmount}
                onOpen={this.handleOpenChangeModal(types.RUNES)}
              />
            </div>
          </If>
        </div>
      </Fragment>
    );
  }
}

export default PendingPayouts;
