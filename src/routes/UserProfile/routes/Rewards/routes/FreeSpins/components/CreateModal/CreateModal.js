import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from '../../../../../../../../constants/propTypes';
import { InputField, DateTimeField, SelectField } from '../../../../../../../../components/ReduxForm';
import { createValidator, translateLabels } from '../../../../../../../../utils/validator';
import { attributeLabels } from './constants';
import Amount, { Currency } from '../../../../../../../../components/Amount';
import NoteButton from '../../../../../../../../components/NoteButton';
import { targetTypes } from '../../../../../../../../constants/note';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { moneyTypeUsageLabels } from '../../../../../../../../constants/bonus';
import { aggregators } from '../../constants';
import MicrogamingAdditionalFields from './MicrogamingAdditionalFields';
import NetentAdditionalFields from './NetentAdditionalFields';

class CreateModal extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    change: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
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
    pristine: false,
    submitting: false,
    disabled: false,
    handleSubmit: null,
    change: null,
    currentValues: {},
    note: null,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    hidePopover: PropTypes.func.isRequired,
  };

  state = {
    currentLines: [],
    currentCoins: [],
    currentCoinSizes: [],
    currentBetLevels: [],
    currentCoinValueLevels: [],
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
    this.props.change('gameName', null);
    this.props.change('clientId', null);
    this.props.change('moduleId', null);
    this.props.change('linesPerSpin', null);
    this.setState({
      currentLines: [],
      currentCoins: [],
      currentCoinSizes: [],
      currentBetLevels: [],
      currentCoinValueLevels: [],
      currentGames: this.props.games.filter(i => i.gameProviderId === e.target.value),
    });
  };

  handleChangeGame = (e) => {
    const { change } = this.props;

    const game = this.state.currentGames.find(i => i.gameId === e.target.value);

    if (game) {
      let linesPerSpin = null;

      if (game.aggregatorId === aggregators.microgaming &&
        Array.isArray(game.lines) && game.lines.length > 0
      ) {
        linesPerSpin = parseInt(Math.max(...game.lines));
      }

      change('linesPerSpin', linesPerSpin);
      change('aggregatorId', game.aggregatorId);
      change('gameId', game.gameId);
      change('gameName', game.fullGameName);
      change('clientId', game.clientId);
      change('moduleId', game.moduleId);

      this.setState({
        currentLines: game.lines,
        currentCoins: game.coins,
        currentCoinSizes: game.coinSizes,
        currentBetLevels: game.betLevels,
        currentCoinValueLevels: game.coinValueLevels,
      });
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

  handleSubmit = (form) => {
    const data = { ...form };

    if (data.aggregatorId === aggregators.netent) {
      data.comment = data.name;
    }

    this.props.onSubmit(data);
  };

  handleSubmitNote = (data) => {
    this.props.onManageNote(data);
    this.context.hidePopover();
  };

  handleDeleteNote = () => {
    this.props.onManageNote(null);
    this.context.hidePopover();
  };

  handleSubmit = (formValues) => {
    const { onSubmit, currentValues } = this.props;

    const data = { ...formValues };
    if (currentValues.aggregatorId === aggregators.microgaming) {
      delete data.linesPerSpin;
    }

    onSubmit(data);
  };

  renderAdditionalFields = () => {
    const { currentValues } = this.props;

    if (!currentValues.aggregatorId) {
      return null;
    }

    if (currentValues.aggregatorId === aggregators.microgaming) {
      return (
        <MicrogamingAdditionalFields
          disabled={!currentValues || !currentValues.providerId}
          approxeBetValueLabel={I18n.t(attributeLabels.approxeBetValue)}
        />
      );
    }

    if (currentValues.aggregatorId === aggregators.netent) {
      const { currentBetLevels, currentCoinValueLevels } = this.state;

      return (
        <NetentAdditionalFields
          currency={currency}
          disabled={!currentValues || !currentValues.providerId}
          betLevels={currentBetLevels}
          coinValueLevels={currentCoinValueLevels}
          betLevelLabel={I18n.t(attributeLabels.betLevel)}
          coinValueLevelLabel={I18n.t(attributeLabels.coinValueLevel)}
        />
      );
    }

    return (
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
    );
  };

  renderPrice = () => {
    const { currentValues, currency } = this.props;
    let betPrice = currentValues && currentValues.betPerLine
      ? parseFloat(currentValues.betPerLine) : 0;
    let linesPerSpin = currentValues && currentValues.linesPerSpin
      ? parseFloat(currentValues.linesPerSpin) : 0;

    if (currentValues.aggregatorId === aggregators.netent) {
      const betLevel = (
        currentValues && currentValues.betLevel
          ? parseFloat(currentValues.betLevel) : 0
      ) || 0;
      const coinValueLevel = (
        currentValues && currentValues.coinValueLevel
          ? parseInt(currentValues.coinValueLevel, 10) : 0
      ) || 0;

      linesPerSpin = 1;
      betPrice = betLevel * coinValueLevel;
    }

    const freeSpinsAmount = currentValues && currentValues.freeSpinsAmount
      ? parseInt(currentValues.freeSpinsAmount, 10) : 0;
    const spinValue = { amount: 0, currency };
    const totalValue = { amount: 0, currency };

    if (!isNaN(betPrice) && !isNaN(linesPerSpin)) {
      spinValue.amount = betPrice * linesPerSpin;
    }
    if (!isNaN(betPrice) && !isNaN(linesPerSpin) && !isNaN(freeSpinsAmount)) {
      totalValue.amount = betPrice * linesPerSpin * freeSpinsAmount;
    }

    return (
      <div className="row margin-bottom-20">
        <div className="col-md-12 text-center">
          <div className="font-size-12 text-muted">
            {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.FREE_SPIN_VALUE')} = <Amount {...spinValue} />
          </div>
          <div className="font-size-12 text-muted">
            {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.TOTAL_VALUE')} = <Amount {...totalValue} />
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      handleSubmit,
      onClose,
      pristine,
      submitting,
      disabled,
      invalid,
      currency,
      currentValues,
      providers,
      note,
    } = this.props;
    const { currentLines, currentGames } = this.state;
    const showLinesPerSpin = (
      currentValues && !!currentValues.aggregatorId && currentValues.aggregatorId !== aggregators.netent
    );

    return (
      <Modal className="create-free-spin-modal" toggle={onClose} isOpen>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalHeader toggle={onClose}>
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
                  <div className="range-group">
                    <Field
                      name="startDate"
                      placeholder={I18n.t(attributeLabels.startDate)}
                      component={DateTimeField}
                      position="vertical"
                      isValidDate={this.startDateValidator('endDate')}
                    />
                    <span className="range-group__separator">-</span>
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
            <div className="row">
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
            <div className="row">
              {
                showLinesPerSpin &&
                <div className="col-md-4">
                  <Field
                    name="linesPerSpin"
                    label={I18n.t(attributeLabels.linesPerSpin)}
                    labelClassName="form-label"
                    position="vertical"
                    component={SelectField}
                    type="number"
                    normalize={v => parseInt(v)}
                    showErrorMessage={false}
                    disabled={
                      !currentValues ||
                      !currentValues.providerId ||
                      !currentValues.gameId ||
                      currentValues.aggregatorId === aggregators.microgaming
                    }
                  >
                    <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_LINES_PER_SPIN')}</option>
                    {currentLines.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Field>
                </div>
              }
              {this.renderAdditionalFields()}
            </div>
            {this.renderPrice()}
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
            </div>
            <div className="row">
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
              <div className="col-md-4">
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
              <div className="col-md-7">
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
            <div className="row">
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
            <button
              className="btn btn-default-outline mr-auto"
              disabled={submitting}
              type="reset"
              onClick={onClose}
            >
              {I18n.t('COMMON.CANCEL')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={pristine || submitting || invalid}
            >
              {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.BUTTON')}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

const FORM_NAME = 'freeSpinManage';
const CreateModalReduxForm = reduxForm({
  form: FORM_NAME,
  validate: (values) => {
    const rules = {
      name: 'required|string',
      startDate: 'required|regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
      endDate: 'required|regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
      providerId: 'required',
      gameId: 'required',
      freeSpinsAmount: ['required', 'integer'],
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

    if (values.aggregatorId === aggregators.microgaming) {
      rules.approxeBetValue = ['required', 'numeric', 'min:1'];
    } else {
      rules.betPerLine = ['required', 'numeric', 'max:1000'];
      rules.linesPerSpin = ['required', 'integer'];
    }

    return createValidator(rules, translateLabels(attributeLabels), false)(values);
  },
})(CreateModal);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(CreateModalReduxForm);
