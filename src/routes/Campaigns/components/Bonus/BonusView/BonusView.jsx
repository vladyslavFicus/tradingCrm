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
import './BonusView.scss';

class BonusView extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
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
    onChangeUUID: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      createOperator: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    uuid: null,
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

    return (
      <div className="bonus-template">
        <div className="row">
          <div className="col-8">
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
          </div>
          <If condition={!disabled}>
            <div className="col-md-4">
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
            <div className="col-md-12">

              <div className="row">
                <div className="col-6">
                  <div className="font-weight-700">
                    {template.name}
                  </div>
                  <div className="small">
                    <Uuid
                      length={16}
                      uuidPartsCount={3}
                      uuid={template.uuid}
                      uuidPrefix="BT"
                    />
                  </div>
                </div>
              </div>

              <div className="row row-top">
                <div className="col-4">
                  <div>Grant Amount</div>
                  <div className="font-weight-700">
                    {
                      template.grantRatioAbsolute
                        ? <Amount {...template.grantRatioAbsolute[0]} />
                        : `${template.grantRatioPercentage}%`
                    }
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <div>Prize</div>
                  <div className="font-weight-700">
                    {
                      template.prizeAbsolute
                        ? <Amount {...template.prizeAbsolute[0]} />
                        : `${template.prizePercentage}%`
                    }
                  </div>
                </div>
                <div className="col-4">
                  <div>Capping</div>
                  <div className="font-weight-700">
                    {
                      template.cappingAbsolute
                        ? <Amount {...template.cappingAbsolute[0]} />
                        : `${template.cappingPercentage}%`
                    }
                  </div>
                </div>
                <div className="col-4">
                  <div>moneyTypePriority</div>
                  <div className="font-weight-700">
                    {template.moneyTypePriority}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <div>wageringRequirement</div>
                  <div className="font-weight-700">
                    {
                      template.wageringRequirementType === customValueFieldTypes.ABSOLUTE
                        ? <Amount {...template.wageringRequirementAbsolute[0]} />
                        : `${template.wageringRequirementPercentage}%`
                    }
                  </div>
                </div>
                <div className="col-4">
                  <div>lockAmountStrategy</div>
                  <div className="font-weight-700">
                    {template.lockAmountStrategy}
                  </div>
                </div>
                <div className="col-4">
                  <div>Bonus Life time</div>
                  <div className="font-weight-700">
                    {template.bonusLifeTime}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <div>Max bet</div>
                  <div className="font-weight-700">
                    {template.maxBet && <Amount {...template.maxBet[0]} />}
                  </div>
                </div>
                <div className="col-4">
                  <div>Claimable</div>
                  <div className="font-weight-700">
                    {template.claimable ? 'Yes' : 'No'}
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
