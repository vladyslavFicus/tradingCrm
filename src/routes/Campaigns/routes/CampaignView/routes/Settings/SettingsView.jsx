import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../../../constants/propTypes';
import Form from '../../../../components/Form';

class SettingsView extends PureComponent {
  static propTypes = {
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
        rewards: data.rewards,
        fulfillments: data.fulfillments,
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
            bonuses,
            freeSpinTemplateUuids,
            bonusTemplateUuids,
            wageringUuids,
          },
        },
      },
    } = this.props;
    const fulfilments = wageringUuids
      .map(uuid => ({ uuid }));
    const rewards = [...bonusTemplateUuids, ...freeSpinTemplateUuids]
      .map(uuid => ({ uuid }));

    return (
      <div>
        <Form
          initialValues={{ name, fulfilments, rewards }}
          bonuses={bonuses}
          freeSpinTemplateUuids={freeSpinTemplateUuids}
          bonusTemplateUuids={bonusTemplateUuids}
          wageringUuids={wageringUuids}
          form="settings"
          onSubmit={this.handleUpdateCampaign}
        />
      </div>
    );
  }
}

export default SettingsView;
