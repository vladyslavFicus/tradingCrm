import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from '../../../../../../../../constants/propTypes';
import { InputField, DateTimeField, SelectField } from '../../../../../../../../components/ReduxForm';
import { createValidator } from '../../../../../../../../utils/validator';
import { attributeLabels } from './constants';
import './CreateModal.scss';
import { Currency } from '../../../../../../../../components/Amount';

class CreateModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    currency: PropTypes.string.isRequired,
    currentValues: PropTypes.shape({
      name: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      prize: PropTypes.string,
      capping: PropTypes.string,
      betPerLine: PropTypes.string,
      linesPerSpin: PropTypes.string,
      freeSpinsAmount: PropTypes.string,
      bonusLifeTime: PropTypes.string,
      multiplier: PropTypes.string,
    }).isRequired,
    providers: PropTypes.arrayOf(PropTypes.string).isRequired,
    games: PropTypes.arrayOf(PropTypes.gameEntity).isRequired,
  };
  static defaultProps = {
    isOpen: false,
    pristine: false,
    submitting: false,
    invalid: false,
    disabled: false,
    handleSubmit: null,
    currentValues: {},
  };

  startDateValidator = toAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[toAttribute]
      ? current.isSameOrBefore(moment(currentValues[toAttribute]))
      : true;
  };

  endDateValidator = fromAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[fromAttribute]
      ? current.isSameOrAfter(moment(currentValues[fromAttribute]))
      : true;
  };

  render() {
    const {
      onSubmit,
      handleSubmit,
      onClose,
      isOpen,
      pristine,
      submitting,
      disabled,
      invalid,
      currency,
      providers,
      games,
      currentValues,
    } = this.props;
    const currentGames = currentValues && currentValues.providerId
      ? games.filter(item => item.gameProviderId === currentValues.providerId)
      : [];
    console.log(currentValues, currentGames, games);

    return (
      <Modal className="create-bonus-modal" toggle={onClose} isOpen={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.TITLE')}
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-10">
                <Field
                  name="name"
                  label={I18n.t(attributeLabels.name)}
                  labelClassName="form-label"
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-10">
                <div className="form-group">
                  <label>{I18n.t(attributeLabels.availabilityDateRange)}</label>

                  <div className="row">
                    <div className="col-md-6">
                      <Field
                        name="startDate"
                        placeholder={I18n.t(attributeLabels.startDate)}
                        component={DateTimeField}
                        position="vertical"
                        isValidDate={this.startDateValidator('startDate')}
                      />
                    </div>
                    <div className="col-md-6">
                      <Field
                        name="endDate"
                        placeholder={I18n.t(attributeLabels.endDate)}
                        component={DateTimeField}
                        position="vertical"
                        isValidDate={this.endDateValidator('endDate')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <Field
                  name="providerId"
                  label={I18n.t(attributeLabels.providerId)}
                  labelClassName="form-label"
                  position="vertical"
                  component={SelectField}
                  showErrorMessage={false}
                >
                  <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_PROVIDER')}</option>
                  {providers.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-md-4">
                <Field
                  name="gameId"
                  label={I18n.t(attributeLabels.gameId)}
                  labelClassName="form-label"
                  position="vertical"
                  component={SelectField}
                  showErrorMessage={false}
                  disabled={!currentValues || !currentValues.providerId}
                >
                  <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_GAME')}</option>
                  {currentGames.map(item => (
                    <option key={item.gameId} value={item.gameId}>
                      {item.fullGameName}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-md-4">
                <Field
                  name="freeSpinsAmount"
                  label={I18n.t(attributeLabels.freeSpinsAmount)}
                  labelClassName="form-label"
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                  showErrorMessage={false}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <Field
                  name="linesPerSpin"
                  label={I18n.t(attributeLabels.linesPerSpin)}
                  labelClassName="form-label"
                  position="vertical"
                  component={SelectField}
                  showErrorMessage={false}
                  disabled={!currentValues || !currentValues.providerId || !currentValues.gameId}
                >
                  <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_LINES_PER_SPIN')}</option>
                  {[].map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-md-4">
                <Field
                  name="betPerLine"
                  label={I18n.t(attributeLabels.betPerLine)}
                  labelClassName="form-label"
                  position="vertical"
                  component={InputField}
                  showErrorMessage={false}
                  disabled={!currentValues || !currentValues.providerId || !currentValues.gameId}
                  inputAddon={<Currency code={currency} />}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <Field
                  name="prize"
                  label={I18n.t(attributeLabels.prize)}
                  labelClassName="form-label"
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                  placeholder={''}
                  inputAddon={<Currency code={currency} />}
                  showErrorMessage={false}
                />
              </div>
              <div className="col-md-3">
                <Field
                  name="capping"
                  label={I18n.t(attributeLabels.capping)}
                  labelClassName="form-label"
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                  placeholder={''}
                  inputAddon={<Currency code={currency} />}
                  showErrorMessage={false}
                />
              </div>
              <div className="col-md-3">
                <Field
                  name="multiplier"
                  label={I18n.t(attributeLabels.multiplier)}
                  labelClassName="form-label"
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                  placeholder={''}
                  showErrorMessage={false}
                />
              </div>
              <div className="col-md-3">
                <Field
                  name="bonusLifeTime"
                  label={I18n.t(attributeLabels.bonusLifeTime)}
                  labelClassName="form-label"
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                  placeholder={''}
                  showErrorMessage={false}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="row">
              <div className="col-md-6">
                <button
                  className="btn btn-default-outline"
                  disabled={submitting}
                  type="reset"
                  onClick={onClose}
                >
                  {I18n.t('COMMON.CANCEL')}
                </button>
              </div>
              <div className="col-md-6 text-right">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={pristine || submitting || invalid}
                >
                  {I18n.t('COMMON.SAVE')}
                </button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

const validatorAttributeLabels = Object.keys(attributeLabels).reduce((res, name) => ({
  ...res,
  [name]: I18n.t(attributeLabels[name]),
}), {});
const FORM_NAME = 'freeSpinManage';
const CreateModalReduxForm = reduxForm({
  form: FORM_NAME,
  validate: (values) => {
    const rules = {
      name: 'required|string',
      startDate: 'required|string',
      endDate: 'required|string',
      providerId: 'required',
      gameId: 'required',
      freeSpinsAmount: ['required', 'integer'],
      linesPerSpin: ['required', 'integer'],
      betPerLine: ['required', 'integer'],
      prize: ['required', 'numeric'],
      capping: ['required', 'numeric'],
      multiplier: 'required|numeric',
      bonusLifeTime: 'required|numeric',
    };

    if (values.prize) {
      const value = parseFloat(values.prize).toFixed(2);

      if (!isNaN(value)) {
        rules.capping.push('greaterThan:prize');
      }
    }

    if (values.capping) {
      const value = parseFloat(values.capping).toFixed(2);

      if (!isNaN(value)) {
        rules.prize.push('lessThan:capping');
      }
    }

    return createValidator(rules, validatorAttributeLabels, false)(values);
  },
})(CreateModal);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(CreateModalReduxForm);
