import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../../../constants/propTypes';
import Form from '../../../../components/Form';
import BonusForm from '../../../../components/Rewards/Bonus';
import { customValueFieldTypes } from '../../../../../../constants/form';

class SettingsView extends Component {
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

  handleSubmitBonusForm = (formData) => {
    const data = {
      name: formData.name,
      lockAmountStrategy: formData.lockAmountStrategy,
      claimable: formData.claimable,
      bonusLifeTime: formData.bonusLifeTime,
      moneyTypePriority: formData.moneyTypePriority,
    };

    const currency = formData.currency;

    ['grantRatio', 'capping', 'prize'].forEach((key) => {
      if (formData[key] && formData[key].value) {
        if (formData[key].type === customValueFieldTypes.ABSOLUTE) {
          data[`${key}Absolute`] = [{
            amount: formData[key].value,
            currency,
          }];
        } else {
          data[`${key}Percentage`] = formData[key].value;
        }
      }
    });

    ['maxBet', 'maxGrantAmount'].forEach((key) => {
      if (formData[key]) {
        data[key] = [{
          amount: formData[key],
          currency,
        }];
      }
    });

    if (formData.wageringRequirement && formData.wageringRequirement.type) {
      if (formData.wageringRequirement.type === customValueFieldTypes.ABSOLUTE) {
        data.wageringRequirementAbsolute = [{
          amount: formData.wageringRequirement.value,
          currency,
        }];
      } else {
        data.wageringRequirementPercentage = formData.wageringRequirement.value;
      }

      data.wageringRequirementType = formData.wageringRequirement.type;
    }
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
      <div>
        <Form
          initialValues={{
            name,
          }}
          form="settings"
          onSubmit={this.handleUpdateCampaign}
        />
        <BonusForm
          initialValues={{
            name: 'vladTest99',
            prize: {
              value: 2,
              type: 'ABSOLUTE',
            },
            capping: {
              value: 3,
              type: 'ABSOLUTE',
            },
            grantRatio: {
              value: 3,
              type: 'ABSOLUTE',
            },
            wageringRequirement: {
              value: 3,
              type: 'ABSOLUTE',
            },
            wagerWinMultiplier: 1,
            moneyTypePriority: 'REAL_MONEY_FIRST',
            maxBet: 12,
            bonusLifeTime: 1,
            claimable: true,
            lockAmountStrategy: 'LOCK_ALL',
          }}
          onSubmit={this.handleSubmitBonusForm}
          currencies={['EUR']}
        />
      </div>
    );
  }
}

export default SettingsView;
