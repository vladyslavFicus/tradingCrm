import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { SubmissionError } from 'redux-form';
import _ from 'lodash';
import PropTypes from '../../../../../../../constants/propTypes';
import { mapResponseErrorToField } from '../constants';
import recognizeFieldError from '../../../../../../../utils/recognizeFieldError';
import Settings from '../../../../../components/BonusCampaign/Settings';
import { statuses } from '../../../../../../../constants/bonus-campaigns';

class View extends Component {
  static propTypes = {
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  bonusCampaign = {
    state: statuses.DRAFT,
  }

  handleSubmit = async (formData) => {
    let data = { ...formData };
    const { createCampaign, createFreeSpinTemplate } = this.props;
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


    const createAction = await createCampaign(data);

    if (!createAction.error) {
      this.context.router.push(`/bonus-campaigns/view/${createAction.payload.campaignUUID}/settings`);
    }

    this.context.addNotification({
      level: createAction.error ? 'error' : 'success',
      title: I18n.t('BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.ADD_CAMPAIGN'),
      message: `${I18n.t('COMMON.ACTIONS.ADDED')} ${createAction.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') :
        I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
    });

    if (createAction.error && createAction.payload.response.fields_errors) {
      const errors = Object.keys(createAction.payload.response.fields_errors).reduce((res, name) => ({
        ...res,
        [name]: I18n.t(createAction.payload.response.fields_errors[name].error),
      }), {});
      throw new SubmissionError(errors);
    } else if (createAction.payload.response && createAction.payload.response.error) {
      const fieldError = recognizeFieldError(createAction.payload.response.error, mapResponseErrorToField);
      if (fieldError) {
        throw new SubmissionError(fieldError);
      } else {
        throw new SubmissionError({ __error: I18n.t(createAction.payload.response.error) });
      }
    }
    if (!createAction.error) {
      this.context.router.push(`/bonus-campaigns/view/${createAction.payload.campaignUUID}/settings`);
    }
  };


  render() {
    const {
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
      fetchCampaigns,
      fetchCampaign,
      change,
    } = this.props;

    return (
      <Settings
        fetchGames={fetchGames}
        fetchFreeSpinTemplates={fetchFreeSpinTemplates}
        fetchFreeSpinTemplate={fetchFreeSpinTemplate}
        templates={templates}
        providers={providers}
        games={games}
        fetchCampaigns={fetchCampaigns}
        fetchCampaign={fetchCampaign}
        handleSubmit={this.handleSubmit}
        addNode={addNode}
        removeNode={removeNode}
        nodeGroups={nodeGroups}
        revert={revert}
        bonusCampaign={this.bonusCampaign}
        locale={locale}
        currencies={currencies}
        change={change}
      />
    );
  }
}

export default View;
