import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from '../../../../../../../../constants/propTypes';
import {
  InputField, DateTimeField, SelectField, CheckBox, RangeGroup,
} from '../../../../../../../../components/ReduxForm';
import { createValidator, translateLabels } from '../../../../../../../../utils/validator';
import { attributeLabels } from './constants';
import Amount, { Currency } from '../../../../../../../../components/Amount';
import NoteButton from '../../../../../../../../components/NoteButton';
import { targetTypes } from '../../../../../../../../constants/note';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { moneyTypeUsage, moneyTypeUsageLabels } from '../../../../../../../../constants/bonus';
import { aggregators } from '../../constants';
import MicrogamingAdditionalFields from './MicrogamingAdditionalFields';
import NetentAdditionalFields from './NetentAdditionalFields';
import { floatNormalize } from '../../../../../../../../utils/inputNormalize';

class CreateModal extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    change: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
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
    }),
    providers: PropTypes.arrayOf(PropTypes.string).isRequired,
    games: PropTypes.arrayOf(PropTypes.gameEntity).isRequired,
    onManageNote: PropTypes.func.isRequired,
    note: PropTypes.noteEntity,
    templates: PropTypes.arrayOf(PropTypes.freeSpinListEntity),
    fetchFreeSpinTemplates: PropTypes.func.isRequired,
    fetchFreeSpinTemplate: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    pristine: false,
    submitting: false,
    handleSubmit: null,
    change: null,
    currentValues: {},
    note: null,
    templates: [],
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
    useTemplate: false,
  };

  componentDidMount() {
    this.props.fetchFreeSpinTemplates({}, true);
  }

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

  handleChangeProvider = (providerId) => {
    this.props.change('providerId', providerId);
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
      currentGames: this.props.games.filter(i => i.gameProviderId === providerId),
    });
  };

  handleChangeGame = (gameId) => {
    const { change } = this.props;

    const game = this.state.currentGames.find(i => i.gameId === gameId);

    if (game) {
      let linesPerSpin = null;

      if (game.aggregatorId === aggregators.microgaming && Array.isArray(game.lines) && game.lines.length > 0) {
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

  handleChangeTemplate = ({ target: { value: templateUUID } }) => {
    this.props.change('templateUUID', templateUUID);

    this.loadTemplateData(templateUUID);
  };

  loadTemplateData = async (templateUUID) => {
    const { fetchFreeSpinTemplate, templates, change } = this.props;

    const templateData = templates.find(i => i.uuid === templateUUID);
    const action = await fetchFreeSpinTemplate(templateUUID, templateData.aggregatorId);

    if (action && !action.error) {
      const {
        name,
        providerId,
        gameId,
        freeSpinsAmount,
        prize,
        capping,
        multiplier,
        moneyTypePriority,
        bonusLifeTime,
        betPerLine,
        linesPerSpin,
      } = action.payload;

      this.handleChangeProvider(providerId);
      this.handleChangeGame(gameId);
      change('name', name);
      change('freeSpinsAmount', freeSpinsAmount);
      change('linesPerSpin', linesPerSpin);
      change('betPerLine', betPerLine);
      change('prize', prize);
      change('capping', capping);
      change('multiplier', multiplier);
      change('capping', capping);
      change('bonusLifeTime', bonusLifeTime);
      change('moneyTypePriority', moneyTypePriority);
    }
  };

  toggleUseTemplate = ({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value;

    if (value) {
      this.props.change('templateUUID', '');
    }

    this.setState({
      useTemplate: value,
    });
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
    const { onSubmit, currentValues } = this.props;

    const data = { ...form };
    if (data.aggregatorId === aggregators.netent) {
      data.comment = data.name;
    }

    if (currentValues.aggregatorId === aggregators.microgaming) {
      delete data.linesPerSpin;
    }

    return onSubmit(data);
  };

  handleSubmitNote = (data) => {
    this.props.onManageNote(data);
    this.context.hidePopover();
  };

  handleDeleteNote = () => {
    this.props.onManageNote(null);
    this.context.hidePopover();
  };

  renderAdditionalFields = () => {
    const { currentValues, currency } = this.props;

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
          type="number"
          normalize={floatNormalize}
          label={I18n.t(attributeLabels.betPerLine)}
          labelClassName="form-label"
          position="vertical"
          component={InputField}
          placeholder="0.00"
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
      pristine,
      submitting,
      invalid,
      currency,
      currentValues,
      providers,
      note,
      templates,
      isOpen,
      onCloseModal,
    } = this.props;

    const {
      currentLines,
      currentGames,
      useTemplate,
    } = this.state;
    const showLinesPerSpin = (
      currentValues && !!currentValues.aggregatorId && currentValues.aggregatorId !== aggregators.netent
    );

    return (
      <Modal className="create-free-spin-modal" toggle={onCloseModal} isOpen={isOpen}>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalHeader toggle={onCloseModal}>
            {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.TITLE')}
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <Field
                  name="rewards-freespins-create-modal-templates-checkbox"
                  type="checkbox"
                  component={CheckBox}
                  id="rewards-freespins-create-modal-templates"
                  label={I18n.t(attributeLabels.useTemplate)}
                  onChange={this.toggleUseTemplate}
                  checked={useTemplate}
                />
                <Field
                  name="templateUUID"
                  label={I18n.t(attributeLabels.template)}
                  labelClassName="form-label"
                  position="vertical"
                  component={SelectField}
                  showErrorMessage={false}
                  onChange={this.handleChangeTemplate}
                  disabled={!useTemplate}
                >
                  <option value="">{I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.CHOOSE_TEMPLATE')}</option>
                  {templates.map(item => (
                    <option key={item.uuid} value={item.uuid}>
                      {item.name}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-md-10">
                <Field
                  name="name"
                  label={I18n.t(attributeLabels.name)}
                  labelClassName="form-label"
                  type="text"
                  component={InputField}
                  position="vertical"
                />
              </div>
            </div>
            <div className="row">
              <RangeGroup
                className="col-md-10"
                label={I18n.t(attributeLabels.availabilityDateRange)}
              >
                <Field
                  name="startDate"
                  placeholder={I18n.t(attributeLabels.startDate)}
                  component={DateTimeField}
                  position="vertical"
                  isValidDate={this.startDateValidator('endDate')}
                />
                <Field
                  name="endDate"
                  placeholder={I18n.t(attributeLabels.endDate)}
                  component={DateTimeField}
                  position="vertical"
                  isValidDate={this.endDateValidator('startDate')}
                />
              </RangeGroup>
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
                  onChange={e => this.handleChangeProvider(e.target.value)}
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
                  onChange={e => this.handleChangeGame(e.target.value)}
                >
                  <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_GAME')}</option>
                  {currentGames.map(item => (
                    <option key={item.internalGameId} value={item.gameId}>
                      {`${item.fullGameName} (${item.gameId})`}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-md-4">
                <Field
                  name="freeSpinsAmount"
                  type="number"
                  label={I18n.t(attributeLabels.freeSpinsAmount)}
                  labelClassName="form-label"
                  component={InputField}
                  normalize={floatNormalize}
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
                    type="number"
                    label={I18n.t(attributeLabels.linesPerSpin)}
                    labelClassName="form-label"
                    position="vertical"
                    component={SelectField}
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
                  component={InputField}
                  position="vertical"
                  placeholder="0.00"
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
                  component={InputField}
                  position="vertical"
                  placeholder="0.00"
                  inputAddon={<Currency code={currency} />}
                  showErrorMessage={false}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <Field
                  name="multiplier"
                  type="number"
                  label={I18n.t(attributeLabels.multiplier)}
                  labelClassName="form-label"
                  normalize={floatNormalize}
                  component={InputField}
                  position="vertical"
                  placeholder=""
                  showErrorMessage={false}
                />
              </div>
              <div className="col-md-4">
                <Field
                  name="bonusLifeTime"
                  label={I18n.t(attributeLabels.bonusLifeTime)}
                  labelClassName="form-label"
                  type="number"
                  normalize={floatNormalize}
                  component={InputField}
                  position="vertical"
                  placeholder=""
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
                  {Object.keys(moneyTypeUsage).map(key => (
                    <option key={key} value={key}>
                      {renderLabel(key, moneyTypeUsageLabels)}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
            <Field
              name="claimable"
              type="checkbox"
              component={CheckBox}
              id="rewards-freespins-create-modal-claimable"
              label={I18n.t('COMMON.CLAIMABLE')}

            />
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
              onClick={onCloseModal}
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
      rules.approxeBetValue = ['required', 'numeric'];
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
