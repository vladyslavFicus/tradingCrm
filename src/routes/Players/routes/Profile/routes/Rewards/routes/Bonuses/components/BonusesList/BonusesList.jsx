import React, { Component, Fragment } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import Amount from '../../../../../../../../../../components/Amount';
import NoteButton from '../../../../../../../../../../components/NoteButton';
import GridView, { GridViewColumn } from '../../../../../../../../../../components/GridView';
import {
  statuses,
  actions as bonusActions,
} from '../../../../../../../../../../constants/bonus';
import { targetTypes } from '../../../../../../../../../../constants/note';
import Uuid from '../../../../../../../../../../components/Uuid';
import BonusGridFilter from '../BonusGridFilter';
import ViewModal from '../ViewModal';
import BonusStatus from '../BonusStatus';
import shallowEqual from '../../../../../../../../../../utils/shallowEqual';
import { mapResponseErrorToField } from '../CreateModal/constants';
import recognizeFieldError from '../../../../../../../../../../utils/recognizeFieldError';

const modalInitialState = { name: null, params: {} };
const MODAL_VIEW = 'view-modal';

class BonusesList extends Component {
  static propTypes = {
    list: PropTypes.pageableState(PropTypes.bonusEntity).isRequired,
    playerProfile: PropTypes.shape({ data: PropTypes.userProfile }).isRequired,
    fetchEntities: PropTypes.func.isRequired,
    createBonusTemplate: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    fetchActiveBonus: PropTypes.func.isRequired,
    addBonusTemplate: PropTypes.func.isRequired,
    fetchBonusTemplates: PropTypes.func.isRequired,
    fetchBonusTemplate: PropTypes.func.isRequired,
    assignBonusTemplate: PropTypes.func.isRequired,
    changeBonusState: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    templates: PropTypes.array,
    modals: PropTypes.shape({
      createManualBonus: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };
  static defaultProps = {
    templates: [],
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
    setRenderActions: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
    filters: {},
    page: 0,
  };

  componentDidMount() {
    const {
      context: {
        registerUpdateCacheListener,
        setNoteChangedCallback,
        setRenderActions,
      },
      constructor: { name },
      handleRefresh,
      handleCreateManualBonusClick,
    } = this;

    handleRefresh();
    setNoteChangedCallback(handleRefresh);
    setRenderActions(() => (
      <button
        className="btn btn-sm btn-primary-outline"
        onClick={handleCreateManualBonusClick}
        id="add-manual-bonus-button"
      >
        {I18n.t('PLAYER_PROFILE.BONUS.MANUAL_BONUS_BUTTON')}
      </button>
    ));
    registerUpdateCacheListener(name, handleRefresh);
  }

  componentWillReceiveProps(nextProps) {
    const { modal: { name, params } } = this.state;

    if (name === MODAL_VIEW && params.item && params.item.bonusUUID) {
      const nextItem = nextProps.list.entities.content.find(i => i.bonusUUID === params.item.bonusUUID);

      if (nextItem && !shallowEqual(nextItem, params.item)) {
        this.setState({ modal: { ...this.state.modal, params: { ...this.state.modal.params, item: nextItem } } });
      }
    }
  }

  componentWillUnmount() {
    const {
      context: {
        unRegisterUpdateCacheListener,
        setRenderActions,
        setNoteChangedCallback,
      },
      constructor: { name },
    } = this;

    setNoteChangedCallback(null);
    setRenderActions(null);
    unRegisterUpdateCacheListener(name);
  }

  getNotePopoverParams = () => ({
    placement: 'left',
  });

  handleNoteClick = (target, note, data) => {
    if (data.note) {
      this.context.onEditNoteClick(target, data.note, this.getNotePopoverParams());
    } else {
      this.context.onAddNoteClick(data.bonusUUID, targetTypes.BONUS)(target, this.getNotePopoverParams());
    }
  };

  handlePageChanged = (page) => {
    this.setState({ page: page - 1 }, this.handleRefresh);
  };

  handleRefresh = () => this.props.fetchEntities({
    ...this.state.filters,
    page: this.state.page,
    playerUUID: this.props.match.params.id,
  })
    .then(() => this.props.fetchActiveBonus(this.props.match.params.id));

  handleFiltersChanged = (inputFilters = {}) => {
    const filters = inputFilters;

    if (filters.states) {
      filters.states = [filters.states];
    }

    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  handleRowClick = async (data) => {
    const { fetchActiveBonus } = this.props;
    const actions = [
      {
        children: I18n.t('COMMON.CLOSE'),
        onClick: this.handleModalClose,
        className: 'btn btn-default-outline text-uppercase',
      },
    ];

    if (data.claimable && data.state === statuses.INACTIVE) {
      const activeBonusAction = await fetchActiveBonus(this.props.match.params.id);
      if (activeBonusAction && !activeBonusAction.error && activeBonusAction.payload.content.length === 0) {
        actions.push({
          children: I18n.t('PLAYER_PROFILE.BONUS.CLAIM_BONUS'),
          onClick: this.handleChangeState(bonusActions.ACCEPT, data.bonusUUID),
          className: 'btn btn-primary text-uppercase',
        });
      }
    }

    const wageredAmount = get(data, 'wagered.amount', 0);
    const amountToWage = get(data, 'amountToWage.amount', 0);
    if (data.state === statuses.IN_PROGRESS && wageredAmount >= amountToWage) {
      actions.push({
        children: I18n.t('PLAYER_PROFILE.BONUS.PERMIT_BONUS_CONVERSION'),
        onClick: this.handleChangeState(bonusActions.PERMIT_CONVERSION, data.bonusUUID),
        className: 'btn btn-default-outline text-uppercase',
        id: `${data.bonusUUID}-permit-bonus-conversion-button`,
      });
    }

    if ([statuses.INACTIVE, statuses.IN_PROGRESS].indexOf(data.state) > -1) {
      actions.push({
        children: I18n.t('PLAYER_PROFILE.BONUS.CANCEL_BONUS'),
        onClick: this.handleChangeState(bonusActions.CANCEL, data.bonusUUID),
        className: 'btn btn-danger text-uppercase',
        id: `${data.bonusUUID}-cancel-button`,
      });
    }

    this.handleModalOpen(MODAL_VIEW, {
      item: data,
      actions,
    });
  };

  handleModalOpen = (name, params) => {
    this.setState({
      modal: {
        name,
        params,
      },
    });
  };

  handleModalClose = (callback) => {
    this.setState({ modal: { ...modalInitialState } }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  handleChangeState = (action, bonusUUID) => async () => {
    const { match: { params: { id: playerUUID } }, changeBonusState } = this.props;

    const response = await changeBonusState(action, bonusUUID, playerUUID);

    this.handleModalClose();

    return response;
  };

  handleCreateManualBonusClick = () => {
    const {
      modals,
      fetchBonusTemplates,
      fetchBonusTemplate,
      playerProfile: { data: { currencyCode: currency } },
    } = this.props;

    modals.createManualBonus.show({
      onSubmit: this.handleSubmitManualBonus,
      fetchBonusTemplate,
      fetchBonusTemplates,
      currency,
    });
  };

  handleSubmitManualBonus = async (isCustomTemplate, formData) => {
    const {
      playerProfile: {
        data: {
          currencyCode: currency,
        },
      },
      match: { params: { id: playerUUID } },
      assignBonusTemplate,
      addBonusTemplate,
      modals,
    } = this.props;

    let bonusTemplateUUID = !isCustomTemplate ? formData.templateUUID : null;

    if (isCustomTemplate) {
      const action = await this.props.createBonusTemplate(formData);

      if (action && !action.error) {
        const { uuid, name } = action.payload;

        bonusTemplateUUID = uuid;
        addBonusTemplate(name, uuid);
      } else if (action.error && action.payload.response) {
        if (get(action, 'payload.response.fields_errors', false)) {
          const errors = Object.keys(action.payload.response.fields_errors).reduce((res, name) => ({
            ...res,
            [name]: I18n.t(action.payload.response.fields_errors[name].error),
          }), {});
          throw new SubmissionError(errors);
        } else if (action.payload.response.error) {
          const fieldError = recognizeFieldError(action.payload.response.error, mapResponseErrorToField);

          if (fieldError) {
            throw new SubmissionError(fieldError);
          } else {
            throw new SubmissionError({ __error: I18n.t(action.payload.response.error) });
          }
        }
      }
    }

    const grantedAmount = formData.grantRatio.value.find(c => c.currency === currency);

    if (grantedAmount) {
      const assignBonusTemplateAction = await assignBonusTemplate(bonusTemplateUUID, {
        playerUUID,
        currency,
        grantedAmount: grantedAmount.amount,
      });

      modals.createManualBonus.hide();
      this.handleRefresh();

      return assignBonusTemplateAction;
    }
  };

  renderMainInfo = data => (
    <Fragment>
      <div className="font-weight-700 cursor-pointer" onClick={() => this.handleRowClick(data)}>
        {data.label}
      </div>
      <Uuid uuid={data.bonusUUID} className="d-block font-size-11" />
      <div className="font-size-11">
        {I18n.t('COMMON.AUTHOR_BY')}
        <Choose>
          <When condition={data.campaignUUID}>
            <Uuid uuid={data.campaignUUID} uuidPrefix="CA" />
          </When>
          <When condition={!data.campaignUUID && data.operatorUUID}>
            <Uuid uuid={data.operatorUUID} uuidPrefix="OP" />
          </When>
        </Choose>
      </div>
    </Fragment>
  );

  renderAvailablePeriod = data => (
    <Choose>
      <When condition={data.createdDate}>
        <div className="font-weight-700">
          {moment.utc(data.createdDate).local().format('DD.MM.YYYY HH:mm')}
        </div>
        <If condition={!!data.expirationDate}>
          <div className="font-size-11">
            {`${I18n.t('COMMON.TO')} ${moment.utc(data.expirationDate).local().format('DD.MM.YYYY HH:mm')}`}
          </div>
        </If>
      </When>
      <Otherwise>
        <div className="font-weight-700">
          &mdash;
        </div>
      </Otherwise>
    </Choose>
  );

  renderGrantedAmount = data => (
    <Fragment>
      <Amount tag="div" className="font-weight-700" {...data.grantedAmount} />
      <div className="font-size-11">
        {I18n.t('PLAYER_PROFILE.BONUS.LOCKED_GRANTED')} <Amount {...data.initialLockedAmount} />
      </div>
    </Fragment>
  );

  renderWageredAmount = (data) => {
    const isCompleted = data.toWager && !isNaN(data.toWager.amount) && data.toWager.amount <= 0;

    return (
      <Amount
        tag="div"
        className={classNames({ 'font-weight-700 color-success': isCompleted })}
        {...data.wagered}
      />
    );
  };

  renderToWagerAmount = data => (
    <Fragment>
      <Amount tag="div" className="font-weight-700" {...data.toWager} />
      <div className="font-size-11">
        {I18n.t('PLAYER_PROFILE.BONUS.AMOUNT_TO_WAGE_PREPENDED_TEXT')} <Amount {...data.amountToWage} />
      </div>
    </Fragment>
  );

  renderClaimableValue = data => (
    <div className="font-weight-700">
      <Choose>
        <When condition={data.claimable}>
          {I18n.t('COMMON.YES')}
        </When>
        <Otherwise>
          {I18n.t('COMMON.NO')}
        </Otherwise>
      </Choose>
    </div>
  );

  renderActions = data => (
    <NoteButton
      id={`bonus-item-note-button-${data.bonusUUID}`}
      note={data.note}
      onClick={this.handleNoteClick}
      targetEntity={data}
    />
  );

  render() {
    const { modal } = this.state;
    const {
      list: { entities, noResults },
      playerProfile: { data: playerProfile },
      locale,
    } = this.props;

    return (
      <Fragment>
        <BonusGridFilter
          onSubmit={this.handleFiltersChanged}
        />
        <div className="tab-wrapper">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            lazyLoad
            locale={locale}
            showNoResults={noResults}
          >
            <GridViewColumn
              name="mainInfo"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.BONUS')}
              render={this.renderMainInfo}
              className="data-grid-layout__big-column"
            />
            <GridViewColumn
              name="available"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.AVAILABLE')}
              render={this.renderAvailablePeriod}
            />
            <GridViewColumn
              name="granted"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.GRANTED')}
              render={this.renderGrantedAmount}
            />
            <GridViewColumn
              name="wagered"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.WAGERED')}
              render={this.renderWageredAmount}
            />
            <GridViewColumn
              name="toWager"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.TO_WAGER')}
              render={this.renderToWagerAmount}
            />
            <GridViewColumn
              name="type"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.CLAIMABLE')}
              render={this.renderClaimableValue}
            />
            <GridViewColumn
              name="status"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.BONUS_STATUS')}
              render={data => <BonusStatus id="bonuses-list" bonus={data} />}
            />
            <GridViewColumn
              name="actions"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.NOTE')}
              render={this.renderActions}
              headerClassName="text-center"
              className="text-center"
            />
          </GridView>
        </div>
        {
          modal.name === MODAL_VIEW &&
          <ViewModal
            isOpen
            playerProfile={playerProfile}
            {...modal.params}
            onClose={this.handleModalClose}
          />
        }
      </Fragment>
    );
  }
}

export default BonusesList;
