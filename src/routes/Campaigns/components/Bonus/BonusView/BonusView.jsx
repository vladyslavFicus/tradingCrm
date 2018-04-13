import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { Field } from 'redux-form';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { NasSelectField } from '../../../../../components/ReduxForm';
import Placeholder from '../../../../../components/Placeholder';

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
    isView: PropTypes.bool,
  };

  static defaultProps = {
    uuid: null,
    onChangeUUID: null,
    isView: false,
    name: '',
    bonusTemplate: {},
    disabled: false,
  }

  handleOpenCreateModal = () => {
    const { modals, onChangeUUID } = this.props;

    modals.createBonus.show({ onSave: onChangeUUID });
  };

  render() {
    const {
      uuid,
      isView,
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
      <div className="bonus-template">
        <div className="row">
          <div className="col-8">
            <Choose>
              <When condition={!isView}>
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
              </When>
              <Otherwise>
                {initialBonusTemplates ? initialBonusTemplates.name : ''}
              </Otherwise>
            </Choose>
          </div>
          <If condition={!disabled && !isView}>
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
