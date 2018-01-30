import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { SubmissionError } from 'redux-form';
import _ from 'lodash';
import Settings from '../../../../../components/BonusCampaign/Settings';
import PropTypes from '../../../../../../../constants/propTypes';

const modalInitialState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    bonusCampaign: PropTypes.bonusCampaignEntity.isRequired,
    bonusCampaignForm: PropTypes.shape({
      campaignName: PropTypes.bonusCampaignEntity.campaignName,
      targetType: PropTypes.bonusCampaignEntity.targetType,
      currency: PropTypes.bonusCampaignEntity.currency,
      startDate: PropTypes.bonusCampaignEntity.startDate,
      endDate: PropTypes.bonusCampaignEntity.endDate,
      wagerWinMultiplier: PropTypes.bonusCampaignEntity.wagerWinMultiplier,
      promoCode: PropTypes.bonusCampaignEntity.promoCode,
      bonusLifetime: PropTypes.bonusCampaignEntity.bonusLifetime,
      campaignRatio: PropTypes.bonusCampaignEntity.campaignRatio,
      conversionPrize: PropTypes.bonusCampaignEntity.conversionPrize,
      capping: PropTypes.bonusCampaignEntity.capping,
      optIn: PropTypes.bonusCampaignEntity.optIn,
      fulfilmentType: PropTypes.bonusCampaignEntity.fulfilmentType,
      minAmount: PropTypes.bonusCampaignEntity.minAmount,
      maxAmount: PropTypes.bonusCampaignEntity.maxAmount,
    }).isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    updateCampaign: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    revert: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
    addNode: PropTypes.func.isRequired,
    fetchGames: PropTypes.func.isRequired,
    createFreeSpinTemplate: PropTypes.func.isRequired,
    fetchFreeSpinTemplates: PropTypes.func.isRequired,
    nodeGroups: PropTypes.shape({
      fulfillments: PropTypes.array.isRequired,
      rewards: PropTypes.array.isRequired,
    }).isRequired,
    games: PropTypes.array,
    providers: PropTypes.array,
    templates: PropTypes.array,
    fetchFreeSpinTemplate: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    fetchCampaigns: PropTypes.func.isRequired,
    fetchCampaign: PropTypes.func.isRequired,
  };

  static defaultProps = {
    games: [],
    providers: [],
    templates: [],
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
    linkedCampaign: null,
  };


  handleSubmit = async (formData) => {
    let data = { ...formData };

    const { params, updateCampaign, createFreeSpinTemplate } = this.props;

    const rewardsFreeSpin = _.get(data, 'rewards.freeSpin');
    if (rewardsFreeSpin) {
      let rewardsFreeSpinData = {};

      if (rewardsFreeSpin.templateUUID) {
        rewardsFreeSpinData = rewardsFreeSpin;
      } else {
        const createAction = await createFreeSpinTemplate({
          claimable: false,
          ...rewardsFreeSpin,
        });

        if (createAction && !createAction.error) {
          rewardsFreeSpinData = createAction.payload;
        } else {
          throw new SubmissionError({
            rewards: {
              freeSpin: {
                name: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.NAME_ALREADY_EXIST'),
              },
            },
          });
        }
      }

      data = {
        ...data,
        ...rewardsFreeSpinData,
      };
    }
  }

  render() {
    const { modal, linkedCampaign } = this.state;
    const {
      bonusCampaign,
      bonusCampaignForm,
      currencies,
      locale,
      revert,
      nodeGroups,
      removeNode,
      addNode,
      games,
      providers,
      templates,
      fetchFreeSpinTemplate,
      fetchFreeSpinTemplates,
      fetchGames,
    } = this.props;

    return (
      <Settings />
    );
  }
}

export default View;
