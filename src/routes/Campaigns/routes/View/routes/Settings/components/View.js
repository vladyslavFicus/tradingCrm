import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../../../../constants/propTypes';
import Form from './Form';
import { withNotifications } from '../../../../../../../components/HighOrder';

class View extends Component {
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
        wageringFulfillments: data.wageringFulfillments,
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
          },
        },
      },
    } = this.props;

    return (
      <Form
        initialValues={{
          name,
        }}
        form="settings"
        onSubmit={this.handleUpdateCampaign}
      />
    );
  }
}

export default withNotifications(View);
