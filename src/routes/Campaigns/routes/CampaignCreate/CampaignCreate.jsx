import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../constants/propTypes';
import Header from './components/Header';
import Form from '../../components/Form';

class CampaignCreate extends PureComponent {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    createCampaign: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleCreateCampaign = async (formData) => {
    const {
      createCampaign,
      notify,
    } = this.props;

    const action = await createCampaign({
      variables: {
        ...formData,
        rewards: formData.rewards.map(({ uuid }) => uuid),
        fulfillments: formData.fulfillments.map(({ uuid }) => uuid),
      },
    });

    const error = get(action, 'data.campaign.create.error');

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.ADD_CAMPAIGN'),
      message: I18n.t(`BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.${error ? 'UNSUCCESSFULLY' : 'SUCCESSFULLY'}`),
    });

    if (!error) {
      const { uuid } = get(action, 'data.campaign.create.data');

      this.context.router.push(`/campaigns/view/${uuid}/settings`);
    }
  };

  render() {
    return (
      <div className="layout layout_not-iframe">
        <div className="layout-info">
          <Header />
        </div>
        <div className="layout-content">
          <div className="nav-tabs-horizontal">
            <Form
              form="createCampaign"
              initialValues={{ rewards: [], fulfillments: [] }}
              onSubmit={this.handleCreateCampaign}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CampaignCreate;
