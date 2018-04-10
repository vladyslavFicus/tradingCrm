import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { customValueFieldTypes } from '../../../../../constants/form';

class BonusView extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      createOperator: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    addBonus: PropTypes.func.isRequired,
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

    modals.createBonus.show({ currencies: ['EUR'], onSubmit: this.handleSubmitBonusForm });
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

export default BonusView;
