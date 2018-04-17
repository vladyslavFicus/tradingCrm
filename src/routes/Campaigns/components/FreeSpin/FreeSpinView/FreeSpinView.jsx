import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { NasSelectField } from '../../../../../components/ReduxForm';
import Placeholder from '../../../../../components/Placeholder';
import BonusView from '../../Bonus/BonusView';
import Uuid from '../../../../../components/Uuid';

export default class FreeSpinView extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    uuid: PropTypes.string,
    onChangeUUID: PropTypes.func.isRequired,
    freeSpinTemplates: PropTypes.shape({
      freeSpinTemplates: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
      })),
    }).isRequired,
    modals: PropTypes.shape({
      createFreeSpin: PropTypes.shape({
        show: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    freeSpinTemplate: PropTypes.shape({
      freeSpinTemplate: PropTypes.shape({
        data: PropTypes.shape({
          uuid: PropTypes.string,
          status: PropTypes.string,
        }),
      }),
    }),
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    freeSpinTemplate: {
      loading: true,
    },
    uuid: null,
    disabled: false,
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
    fields: PropTypes.object,
  };

  handleOpenModal = () => {
    const { modals: { createFreeSpin }, onChangeUUID } = this.props;

    createFreeSpin.show({ onSave: onChangeUUID });
  };

  render() {
    const {
      uuid,
      freeSpinTemplates: {
        freeSpinTemplates,
      },
      name,
      freeSpinTemplate: {
        loading,
        freeSpinTemplate,
      },
      disabled,
    } = this.props;

    const fsTemplates = freeSpinTemplates || [];
    const fsTemplate = get(freeSpinTemplate, 'data', {});

    return (
      <div className="campaigns-template">
        <div className="row">
          <div className="col-8">
            <Field
              name={`${name}.uuid`}
              id={`${name}-uuid`}
              disabled={disabled}
              label="Free-spin template"
              component={NasSelectField}
              showErrorMessage={false}
              position="vertical"
            >
              {fsTemplates.map(item => (
                <option key={item.uuid} value={item.uuid}>
                  {item.name}
                </option>
              ))}
            </Field>
            <If condition={fsTemplate.uuid}>
              <div className="form-group__note">
                <Uuid
                  length={16}
                  uuidPartsCount={4}
                  uuid={fsTemplate.uuid}
                  uuidPrefix="FS"
                />
              </div>
            </If>
          </div>
          <If condition={!disabled}>
            <div className="col-auto">
              <button
                className="btn btn-primary text-uppercase margin-top-20"
                type="button"
                onClick={this.handleOpenModal}
              >
                Add free spin template
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
                <TextRow className="animated-background" style={{ width: '80%', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '80%', height: '12px' }} />
                <TextRow className="animated-background" style={{ width: '80%', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '80%', height: '12px' }} />
              </div>
            )}
          >
            <div>
              <div className="row no-gutters mt-3 campaigns-template__bordered-block">
                <div className="col-4">
                  Provider
                  <div className="campaigns-template__value">
                    {fsTemplate.providerId}
                  </div>
                </div>
                <div className="col-4">
                  Game
                  <div className="campaigns-template__value">
                    {fsTemplate.gameId}
                  </div>
                </div>
                <div className="col-4">
                  status
                  <div className="campaigns-template__value">
                    {fsTemplate.status}
                  </div>
                </div>
              </div>
              <div className="row no-gutters my-3">
                <div className="col-7">
                  <div className="row">
                    <div className="col">
                      Free-spins
                      <div className="campaigns-template__value">
                        {fsTemplate.freeSpinsAmount}
                      </div>
                    </div>
                    <div className="col">
                      Life Time
                      <div className="campaigns-template__value">
                        {fsTemplate.freeSpinLifeTime}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5">
                  <div className="row no-gutters">
                    <div className="col-6 pr-2">
                      <div className="free-spin-card">
                        <div className="free-spin-card-values">Props</div>
                        <div className="free-spin-card-values">Props</div>
                        <div className="free-spin-card-label">spinValue</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="free-spin-card">
                        <div className="free-spin-card-values">Props</div>
                        <div className="free-spin-card-values">Props</div>
                        <div className="free-spin-card-label">totalValue</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row no-gutters">
                <If condition={fsTemplate.linesPerSpin}>
                  <div className="col-4">
                    lines per spin
                    <div className="campaigns-template__value">
                      {fsTemplate.linesPerSpin}
                    </div>
                  </div>
                </If>
                <If condition={fsTemplate.betPerLine}>
                  <div className="col-4">
                    Bet per line
                    <div className="campaigns-template__value">
                      {fsTemplate.betPerLine}
                    </div>
                  </div>
                </If>
              </div>
              <If condition={fsTemplate.coinSize || fsTemplate.betLevel || fsTemplate.pageCode}>
                <div className="row no-gutters my-3">
                  <If condition={fsTemplate.coinSize}>
                    <div className="col-4">
                      Coin size
                      <div className="campaigns-template__value">
                        {fsTemplate.coinSize}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.betLevel}>
                    <div className="col-4">
                      Bet level
                      <div className="campaigns-template__value">
                        {fsTemplate.betLevel}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.pageCode}>
                    <div className="col-4">
                      Page code
                      <div className="campaigns-template__value">
                        {fsTemplate.pageCode}
                      </div>
                    </div>
                  </If>
                </div>
              </If>
              <If condition={fsTemplate.betMultiplier || fsTemplate.rhfpBet || fsTemplate.comment}>
                <div className="row no-gutters">
                  <If condition={fsTemplate.betMultiplier}>
                    <div className="col-4">
                      Bet Per Line
                      <div className="campaigns-template__value">
                        {fsTemplate.betMultiplier}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.rhfpBet}>
                    <div className="col-4">
                      Bet level
                      <div className="campaigns-template__value">
                        {fsTemplate.rhfpBet}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.comment}>
                    <div className="col-4">
                      Comment
                      <div className="campaigns-template__value">
                        {fsTemplate.comment}
                      </div>
                    </div>
                  </If>
                </div>
              </If>
              <If condition={fsTemplate.bonusTemplateUUID}>
                <BonusView uuid={fsTemplate.bonusTemplateUUID} isViewMode />
              </If>
            </div>
          </Placeholder>
        </If>
      </div>
    );
  }
}
