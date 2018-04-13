import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../../../constants/propTypes';
import Form from '../../../../components/Form';
import { statuses } from '../../../../../../constants/bonus-campaigns';

class SettingsView extends PureComponent {
  static propTypes = {
    updateCampaign: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    campaign: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      campaign: PropTypes.shape({
        data: PropTypes.newBonusCampaignEntity.isRequired,
      }),
    }).isRequired,
  };

  handleUpdateCampaign = async (formData) => {
    const {
      updateCampaign,
      notify,
      campaign: {
        campaign: {
          data,
        },
      },
    } = this.props;

    const action = await updateCampaign({
      variables: {
        ...formData,
        uuid: data.uuid,
        rewards: formData.rewards.map(({ uuid }) => uuid),
        fulfillments: formData.fulfillments.map(({ uuid }) => uuid),
      },
    });

    const error = get(action, 'data.campaign.update.error');

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.UPDATE_TITLE'),
      message: I18n.t(`BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.${error ? 'UNSUCCESSFULLY' : 'SUCCESSFULLY'}`),
    });
  };

  render() {
    const {
      campaign: {
        campaign: {
          data: {
            name,
            state,
            fulfillments,
            rewards,
          },
        },
      },
    } = this.props;

    return (
      <Form
        disabled={state !== statuses.DRAFT}
        initialValues={{
          name,
          fulfillments,
          rewards,
        }}
        fulfillments={fulfillments}
        form="settings"
        onSubmit={this.handleUpdateCampaign}
      />
    );
  }
}

export default SettingsView;
