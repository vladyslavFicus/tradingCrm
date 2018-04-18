import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Field } from 'redux-form';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { NasSelectField } from '../../../../../components/ReduxForm';
import Placeholder from '../../../../../components/Placeholder';
import Amount from '../../../../../components/Amount';
import Uuid from '../../../../../components/Uuid';
import { customValueFieldTypes } from '../../../../../constants/form';

class BonusView extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    uuid: PropTypes.string,
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
    }),
    onChangeUUID: PropTypes.func,
    modals: PropTypes.shape({
      createOperator: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    disabled: PropTypes.bool,
    isViewMode: PropTypes.bool,
  };

  static defaultProps = {
    uuid: null,
    onChangeUUID: null,
    isViewMode: false,
    name: '',
    bonusTemplate: {},
    disabled: false,
  };

  handleOpenCreateModal = () => {
    const { modals, onChangeUUID } = this.props;

    modals.createBonus.show({ onSave: onChangeUUID });
  };

  render() {
    const {
      uuid,
      isViewMode,
      disabled,
      name,
      shortBonusTemplates: {
        shortBonusTemplates,
      },
      bonusTemplate,
    } = this.props;

    const bonusTemplates = shortBonusTemplates || [];
    const template = get(bonusTemplate, 'bonusTemplate.data', {});
    const loading = get(bonusTemplate, 'loading', true);
    const initialBonusTemplates = bonusTemplates.find(item => item.uuid === uuid);

    return (
      <div className="campaigns-template">
        <div className="row">
          <div className="col">
            <Choose>
              <When condition={!isViewMode}>
                <Field
                  name={`${name}.uuid`}
                  id={`${name}-uuid`}
                  disabled={disabled}
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
                <If condition={template.uuid}>
                  <div className="form-group__note">
                    <Uuid
                      length={16}
                      uuidPartsCount={3}
                      uuid={template.uuid}
                      uuidPrefix="BT"
                    />
                  </div>
                </If>
              </When>
              <Otherwise>
                {initialBonusTemplates ? initialBonusTemplates.name : ''}
              </Otherwise>
            </Choose>
          </div>
          <If condition={!disabled && !isViewMode}>
            <div className="col-auto">
              <button
                className="btn btn-primary text-uppercase margin-top-20"
                type="button"
                onClick={this.handleOpenCreateModal}
              >
              Add bonus template
              </button>
            </div>
          </If>
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
              <div className="row no-gutters mt-3 campaigns-template__bordered-block">
                <div className="col-4">
                  Grant Amount
                  <div className="campaigns-template__value">
                    <Choose>
                      <When condition={template.grantRatioAbsolute}>
                        <Amount {...template.grantRatioAbsolute[0]} />
                      </When>
                      <Otherwise>
                        {template.grantRatioPercentage}%
                      </Otherwise>
                    </Choose>
                  </div>
                </div>
              </div>
              <div className="row no-gutters my-3">
                <div className="col-4">
                  Prize
                  <div className="campaigns-template__value">
                    <Choose>
                      <When condition={template.prizeAbsolute || template.prizePercentage !== null}>
                        <Choose>
                          <When condition={template.prizeAbsolute}>
                            <Amount {...template.prizeAbsolute[0]} />
                          </When>
                          <Otherwise>
                            {template.prizePercentage}%
                          </Otherwise>
                        </Choose>
                      </When>
                      <Otherwise>
                        -
                      </Otherwise>
                    </Choose>
                  </div>
                </div>
                <div className="col-4">
                  Capping
                  <div className="campaigns-template__value">
                    <Choose>
                      <When condition={template.cappingAbsolute || template.cappingPercentage !== null}>
                        <Choose>
                          <When condition={template.cappingAbsolute}>
                            <Amount {...template.cappingAbsolute[0]} />
                          </When>
                          <Otherwise>
                            {template.cappingPercentage}%
                          </Otherwise>
                        </Choose>
                      </When>
                      <Otherwise>
                        -
                      </Otherwise>
                    </Choose>
                  </div>
                </div>
                <div className="col-4">
                  Money type priority
                  <div className="campaigns-template__value">
                    {template.moneyTypePriority}
                  </div>
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-4">
                  Wagering
                  <div className="campaigns-template__value">
                    <Choose>
                      <When condition={template.wageringRequirementAbsolute || template.wageringRequirementPercentage !== null}>
                        <Choose>
                          <When condition={template.wageringRequirementType === customValueFieldTypes.ABSOLUTE}>
                            <Amount {...template.wageringRequirementAbsolute[0]} />
                          </When>
                          <Otherwise>
                            {template.wageringRequirementPercentage}%
                          </Otherwise>
                        </Choose>
                      </When>
                      <Otherwise>
                        -
                      </Otherwise>
                    </Choose>
                  </div>
                </div>
                <div className="col-4">
                  Withdrawal lock
                  <div className="campaigns-template__value">
                    {template.lockAmountStrategy}
                  </div>
                </div>
                <div className="col-4">
                  Bonus Life time
                  <div className="campaigns-template__value">
                    {template.bonusLifeTime}
                  </div>
                </div>
              </div>
              <div className="row no-gutters my-3">
                <div className="col-4">
                  Max bet
                  <div className="campaigns-template__value">
                    {template.maxBet && <Amount {...template.maxBet[0]} />}
                  </div>
                </div>
                <div className="col-4">
                  Claimable
                  <div className="campaigns-template__value">
                    <Choose>
                      <When condition={template.claimable}>
                        Yes
                      </When>
                      <Otherwise>
                        No
                      </Otherwise>
                    </Choose>
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
