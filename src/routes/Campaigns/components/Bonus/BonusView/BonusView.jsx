import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { Field } from 'redux-form';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { NasSelectField } from '../../../../../components/ReduxForm';
import { customValueFieldTypes } from '../../../../../constants/form';
import Placeholder from '../../../../../components/Placeholder';

class BonusView extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    shortBonusTemplates: PropTypes.shape({
      bonusTemplates: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        name: PropTypes.string,
      })),
    }).isRequired,
    bonusTemplate: PropTypes.shape({
      bonusTemplate: PropTypes.shape({
        data: PropTypes.shape({
          uuid: PropTypes.string,
          name: PropTypes.string,
        }),
      }),
    }).isRequired,
    modals: PropTypes.shape({
      createOperator: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    addBonus: PropTypes.func.isRequired,
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
    const {
      uuid,
      name,
      shortBonusTemplates: {
        shortBonusTemplates,
      },
      bonusTemplate,
    } = this.props;

    const bonusTemplates = shortBonusTemplates || [];
    const template = get(bonusTemplate, 'bonusTemplate.data', {});
    const loading = get(bonusTemplate, 'loading', true);

    return (
      <div className="bonus-template">
        <div className="row">
          <div className="col-8">
            <Field
              name={`${name}.uuid`}
              id={`${name}-uuid`}
              label="Bonus templates"
              component={NasSelectField}
              showErrorMessage={false}
              position="vertical"
            >
              {bonusTemplates.map(item => (
                <option key={item.uuid} value={item.uuid}>
                  {item.name}
                </option>
              ))}
            </Field>
          </div>
          <div className="col-md-4">
            <button
              className="btn btn-primary text-uppercase margin-top-20"
              type="button"
              onClick={this.handleOpenCreateModal}
            >
              Add bonus template
            </button>
          </div>
        </div>
        <If condition={uuid}>
          <Placeholder
            ready={!loading}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '80%', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '80%', height: '12px' }} />
              </div>
            )}
          >
            <div>
              <div className="row">
                <div className="col-4 bonus-template__item">
                  <div className="bonus-template">uuid</div>
                  <div>
                    <div className="bonus-template">{template.uuid}</div>
                  </div>
                </div>
                <div className="col-4 bonus-template__item">
                  <div className="bonus-template">Name</div>
                  <div>
                    <div className="bonus-template">{template.name}</div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-4 bonus-template__item">
                  <div className="bonus-template">moneyTypePriority</div>
                  <div>
                    <div className="bonus-template">{template.moneyTypePriority}</div>
                  </div>
                </div>
                <div className="col-4 bonus-template__item">
                  <div className="bonus-template">claimable</div>
                  <div>
                    <div className="bonus-template">{template.claimable}</div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-4 bonus-template__item">
                  <div className="bonus-template">lockAmountStrategy</div>
                  <div>
                    <div className="bonus-template">{template.lockAmountStrategy}</div>
                  </div>
                </div>
                <div className="col-4 bonus-template__item">
                  <div className="bonus-template">bonusLifeTime</div>
                  <div>
                    <div className="bonus-template">{template.bonusLifeTime}</div>
                  </div>
                </div>
              </div>
            </div>
          </Placeholder>
        </If>
      </div>
    );
  }
}

export default BonusView;
