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
} from '../../../../../../../constants/rewardPlan';

class PendingPayouts extends Component {
  static propTypes = {
    modals: PropTypes.shape({
      rewardPlanModal: PropTypes.modalType,
    }).isRequired,
    pendingPlanMutation: PropTypes.func.isRequired,
    pendingPayouts: PropTypes.shape({
      loading: PropTypes.bool,
      rewardPlan: PropTypes.shape({
        data: PropTypes.object,
      }),
    }),
    currency: PropTypes.string.isRequired,
  };
  static contextTypes = {
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
  };
  static defaultProps = {
    pendingPayouts: {},
  };

  componentDidMount() {
    const {
      context: { registerUpdateCacheListener },
      constructor: { name },
      props: { pendingPayouts: { refetch } },
    } = this;

    registerUpdateCacheListener(name, refetch);
  }

  componentWillUnmount() {
    const { unRegisterUpdateCacheListener } = this.context;
    const { name: componentName } = this.constructor;

    unRegisterUpdateCacheListener(componentName);
  }

  handleOpenUpdateAmountModal = type => () => {
    const {
      pendingPayouts,
      modals: {
        rewardPlanModal,
      },
    } = this.props;

    const { amount } = get(pendingPayouts, 'pendingRewardPlan.data.plans').find(item => item.type === type);

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
      modals: {
        rewardPlanModal,
      },
      notify,
      match: {
        params: {
          id: playerUUID,
        },
      },
      pendingPlanMutation,
    } = this.props;

    const action = await pendingPlanMutation({
      variables: {
        amount,
        type,
        isActive: false,
        playerUUID,
      },
    });

    const error = get(action, 'data.pendingRewardPlan.update.error');

    notify({
      level: !error ? 'success' : 'error',
      title: I18n.t('PROFILE.REWARD_PLAN.NOTIFICATION.UPDATE_MESSAGE'),
    });

    rewardPlanModal.hide();
  };

  renderPlan = (data) => {
    const { currency } = this.props;
    const { type } = data;

    const amount = [types.BONUS, types.CASH_BACKS].includes(type)
      ? <Amount amount={data.amount} currency={currency} />
      : data.amount;

    return (
      <RewardPlan
        title={typesTitle[data.type]}
        available
        amount={amount}
        onClick={this.handleOpenUpdateAmountModal(type)}
      />
    );
  };

  render() {
    const {
      pendingPayouts,
      pendingPayouts: {
        loading,
      },
    } = this.props;

    const error = get(pendingPayouts, 'pendingRewardPlan.error.error', false);
    const plans = get(pendingPayouts, 'pendingRewardPlan.data.plans', []);

    return (
      <div className="col-md-2">
        <div className="account-details__label">
          {I18n.t('PLAYER_PROFILE.PROFILE.REWARD_PLANS.TITLE')}
        </div>
        <div className="card">
          <div className="card-body">
            <Choose>
              <When condition={!error}>
                <If condition={!loading}>
                  <For each="plan" index="index" of={plans}>
                    <div key={index}>
                      {this.renderPlan(plan)}
                    </div>
                  </For>
                </If>
              </When>
              <Otherwise>
                <div className="header-block-middle">
                  {I18n.t('COMMON.NOT_AVAILABLE')}
                </div>
              </Otherwise>
            </Choose>
          </div>
        </div>
      </div>
    );
  }
}

export default PendingPayouts;
