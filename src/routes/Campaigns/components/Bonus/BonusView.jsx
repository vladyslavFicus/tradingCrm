import React, { PureComponent } from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { withModals, withNotifications } from '../../../../components/HighOrder';
import { customValueFieldTypes } from '../../../../constants/form';
import { addBonusMutation } from '.././../../../graphql/mutations/bonusTemplates';
import CreateBonusModal from './CreateBonusModal';

class BonusView extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      createOperator: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    uuid: PropTypes.string.isRequired,
  };

  handleSubmitBonusForm = async (formData) => {
    const {
      addBonus,
      notify,
      modals,
    } = this.props;

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

    const action = await addBonus({ variables: data });

    const error = get(action, 'data.bonusTemplate.add.error');
    notify({
      level: error ? 'error' : 'success',
      title: 'Title',
      message: 'Message',
    });

    if (!error) {
      const uuid = get(action, 'data.bonusTemplate.add.data.uuid');
      console.info('ADDED BONUS TPL WITH UUID', uuid);
      modals.createBonus.hide();
    }
  };

  handleOpenCreateModal = () => {
    const { modals } = this.props;

    modals.createBonus.show({
      currencies: ['EUR'],
      onSubmit: this.handleSubmitBonusForm,
      initialValues: {
        name: `vladTest${Math.random(0, 999)}`,
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
        currency: 'EUR',
      },
    });
  };

  render() {
    const { uuid } = this.props;

    return (
      <div className="row">
        {uuid}
        TODO BONUS VIEW
        <button
          type="button"
          onClick={this.handleOpenCreateModal}
        >
          Add
        </button>
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withModals({ createBonus: CreateBonusModal }),
  graphql(addBonusMutation, {
    name: 'addBonus',
  }),
)(BonusView);
