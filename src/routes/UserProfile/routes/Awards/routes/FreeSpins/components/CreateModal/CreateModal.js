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
import Amount, { Currency } from '../../../../../../../../components/Amount';
import NoteButton from '../../../../../../../../components/NoteButton';
import { targetTypes } from '../../../../../../../../constants/note';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { moneyTypeUsageLabels } from '../../../../../../../../constants/bonus';
import './CreateModal.scss';

class CreateModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    handleSubmit: PropTypes.func,
    change: PropTypes.func,
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
    onManageNote: PropTypes.func.isRequired,
    note: PropTypes.noteEntity,
  };
  static defaultProps = {
    isOpen: false,
    pristine: false,
    submitting: false,
    invalid: false,
    disabled: false,
    handleSubmit: null,
    change: null,
    currentValues: {},
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    hidePopover: PropTypes.func.isRequired,
  };

  state = {
    currentLines: [],
    currentGames: [],
  };

  getNotePopoverParams = () => ({
    placement: 'bottom',
    onSubmit: this.handleSubmitNote,
    onDelete: this.handleDeleteNote,
  });

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

  handleChangeProvider = (e) => {
    this.props.change('providerId', e);
    this.props.change('gameId', null);
    this.props.change('linesPerSpin', null);
    this.setState({
      currentLines: [],
      currentGames: this.props.games.filter(i => i.gameProviderId === e.target.value),
    });
  };

  handleChangeGame = (e) => {
    const game = this.state.currentGames.find(i => i.gameId === e.target.value);

    if (game) {
      this.props.change('aggregatorId', game.aggregatorId);
      this.props.change('gameId', game.gameId);
      this.props.change('linesPerSpin', null);
      this.setState({ currentLines: game.lines });
    }
  };

  handleNoteClick = (target) => {
    const { note } = this.props;
    if (note) {
      this.context.onEditNoteClick(target, note, this.getNotePopoverParams());
    } else {
      this.context.onAddNoteClick(null, targetTypes.FREE_SPIN)(target, this.getNotePopoverParams());
    }
  };

  handleSubmitNote = data => new Promise((resolve) => {
    this.props.onManageNote(data);
    this.context.hidePopover();
    resolve();
  });

  handleDeleteNote = () => new Promise((resolve) => {
    this.props.onManageNote(null);
    this.context.hidePopover();
    resolve();
  });

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
      currentValues,
      note,
    } = this.props;
    const { currentLines, currentGames } = this.state;
    const betPerLine = currentValues && currentValues.betPerLine
      ? parseFloat(currentValues.betPerLine) : 0;
    const linesPerSpin = currentValues && currentValues.linesPerSpin
      ? parseFloat(currentValues.linesPerSpin) : 0;
    const freeSpinsAmount = currentValues && currentValues.freeSpinsAmount
      ? parseInt(currentValues.freeSpinsAmount, 10) : 0;
    const spinValue = { amount: 0, currency };
    const totalValue = { amount: 0, currency };

    if (!isNaN(betPerLine) && !isNaN(linesPerSpin)) {
      spinValue.amount = betPerLine * linesPerSpin;
    }
    if (!isNaN(betPerLine) && !isNaN(linesPerSpin) && !isNaN(freeSpinsAmount)) {
      totalValue.amount = betPerLine * linesPerSpin * freeSpinsAmount;
    }

    return (
      <Modal className="create-free-spin-modal" toggle={onClose} isOpen={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={onClose}>
            {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.TITLE')}
          </ModalHeader>
          <ModalBody>
            <div className="row margin-bottom-20">
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
            <div className="row margin-bottom-20">
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
                        isValidDate={this.startDateValidator('endDate')}
                      />
                    </div>
                    <div className="col-md-6">
                      <Field
                        name="endDate"
                        placeholder={I18n.t(attributeLabels.endDate)}
                        component={DateTimeField}
                        position="vertical"
                        isValidDate={this.endDateValidator('startDate')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row margin-bottom-20">
              <div className="col-md-4">
                <Field
                  name="providerId"
                  label={I18n.t(attributeLabels.providerId)}
                  labelClassName="form-label"
                  position="vertical"
                  component={SelectField}
                  showErrorMessage={false}
                  onChange={this.handleChangeProvider}
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
                  onChange={this.handleChangeGame}
                >
                  <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_GAME')}</option>
                  {currentGames.map(item => (
                    <option key={item.gameId} value={item.gameId}>
                      {`${item.fullGameName} (${item.gameId})`}
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
            <div className="row margin-bottom-20">
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
                  {currentLines.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-md-4">
                <Field
                  name="betPerLine"
                  type="text"
                  label={I18n.t(attributeLabels.betPerLine)}
                  labelClassName="form-label"
                  position="vertical"
                  component={InputField}
                  placeholder={'0.00'}
                  showErrorMessage
                  disabled={!currentValues || !currentValues.providerId || !currentValues.gameId}
                  inputAddon={<Currency code={currency} />}
                />
              </div>
              <div className="col-md-4">
                <div className="margin-top-30">
                  <div className="font-size-12 text-muted">
                    {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.FREE_SPIN_VALUE')} = <Amount {...spinValue} />
                  </div>
                  <div className="font-size-12 text-muted">
                    {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.TOTAL_VALUE')} = <Amount {...totalValue} />
                  </div>
                </div>
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
                  placeholder={'0.00'}
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
                  placeholder={'0.00'}
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
            <div className="row">
              <div className="col-md-4">
                <Field
                  name="moneyTypePriority"
                  label={I18n.t(attributeLabels.moneyTypePriority)}
                  type="select"
                  component={SelectField}
                  position="vertical"
                >
                  {Object.keys(moneyTypeUsageLabels).map(key => (
                    <option key={key} value={key}>
                      {renderLabel(key, moneyTypeUsageLabels)}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
            <div className="row margin-top-20">
              <div className="col-md-12 text-center">
                <NoteButton
                  id="free-spin-create-modal-note"
                  note={note}
                  onClick={this.handleNoteClick}
                  preview
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
      betPerLine: ['required', 'numeric', 'max:1000'],
      prize: ['numeric'],
      capping: ['numeric'],
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
