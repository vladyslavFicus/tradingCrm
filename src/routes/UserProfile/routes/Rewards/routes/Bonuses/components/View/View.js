import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../../../../../constants/propTypes';
import Amount from '../../../../../../../../components/Amount';
import NoteButton from '../../../../../../../../components/NoteButton';
import GridView, { GridColumn } from '../../../../../../../../components/GridView';
import { statuses } from '../../../../../../../../constants/bonus';
import { targetTypes } from '../../../../../../../../constants/note';
import Uuid from '../../../../../../../../components/Uuid';
import BonusGridFilter from '../BonusGridFilter';
import ViewModal from '../ViewModal';
import BonusType from '../BonusType';
import BonusStatus from '../BonusStatus';
import shallowEqual from '../../../../../../../../utils/shallowEqual';
import { mapResponseErrorToField } from '../CreateModal/constants';
import recognizeFieldError from '../../../../../../../../utils/recognizeFieldError';
import StickyNavigation from '../../../../../../components/StickyNavigation';

const modalInitialState = { name: null, params: {} };
const MODAL_VIEW = 'view-modal';

class View extends Component {
  static propTypes = {
    list: PropTypes.pageableState(PropTypes.bonusEntity).isRequired,
    playerProfile: PropTypes.shape({ data: PropTypes.userProfile }).isRequired,
    fetchEntities: PropTypes.func.isRequired,
    createBonusTemplate: PropTypes.func.isRequired,
    cancelBonus: PropTypes.func.isRequired,
    permitBonusConversion: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    fetchActiveBonus: PropTypes.func.isRequired,
    addBonusTemplate: PropTypes.func.isRequired,
    fetchBonusTemplates: PropTypes.func.isRequired,
    fetchBonusTemplate: PropTypes.func.isRequired,
    assignBonusTemplate: PropTypes.func.isRequired,
    acceptBonus: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    subTabRoutes: PropTypes.arrayOf(PropTypes.subTabRouteEntity).isRequired,
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
    cacheChildrenComponent: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
    filters: {},
    page: 0,
  };

  componentWillMount() {
    this.handleRefresh();
    this.context.cacheChildrenComponent(this);
  }

  componentDidMount() {
    this.context.setNoteChangedCallback(this.handleRefresh);
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
    this.context.setNoteChangedCallback(null);
    this.context.cacheChildrenComponent(null);
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
    playerUUID: this.props.params.id,
  })
    .then(() => this.props.fetchActiveBonus(this.props.params.id));

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
      const activeBonusAction = await fetchActiveBonus(this.props.params.id);
      if (activeBonusAction && !activeBonusAction.error && activeBonusAction.payload.content.length === 0) {
        actions.push({
          children: I18n.t('PLAYER_PROFILE.BONUS.CLAIM_BONUS'),
          onClick: this.handleClaimBonus.bind(null, data.bonusUUID),
          className: 'btn btn-primary text-uppercase',
        });
      }
    }

    const wageredAmount = get(data, 'wagered.amount', 0);
    const amountToWage = get(data, 'amountToWage.amount', 0);
    if (data.state === statuses.IN_PROGRESS && wageredAmount >= amountToWage) {
      actions.push({
        children: I18n.t('PLAYER_PROFILE.BONUS.PERMIT_BONUS_CONVERSION'),
        onClick: this.handlePermitBonusConversion.bind(null, data.bonusUUID),
        className: 'btn btn-default-outline text-uppercase',
        id: `${data.bonusUUID}-permit-bonus-conversion-button`,
      });
    }

    if ([statuses.INACTIVE, statuses.IN_PROGRESS].indexOf(data.state) > -1) {
      actions.push({
        children: I18n.t('PLAYER_PROFILE.BONUS.CANCEL_BONUS'),
        onClick: this.handleCancelBonus.bind(null, data.bonusUUID),
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

  handleClaimBonus = (bonusUUID) => {
    this.props.acceptBonus(bonusUUID, this.props.params.id)
      .then(() => {
        this.handleModalClose(this.handleRefresh);
      });
  };

  handleCancelBonus = (bonusUUID) => {
    this.props.cancelBonus(bonusUUID, this.props.params.id)
      .then(() => {
        this.handleModalClose(this.handleRefresh);
      });
  };

  handlePermitBonusConversion = async (bonusUUID) => {
    const { params: { id: playerUUID }, permitBonusConversion } = this.props;

    const action = await permitBonusConversion(bonusUUID, playerUUID);

    this.handleModalClose(this.handleRefresh);

    return action;
  };

  handleCreateManualBonusClick = async () => {
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
      params: { id: playerUUID },
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

    const grantedAmount = formData.grantRatio.value.currencies.find(c => c.currency === currency);

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
    <div>
      <div className="font-weight-700 cursor-pointer" onClick={() => this.handleRowClick(data)}>
        {data.label}
      </div>
      <div className="font-size-11">
        <Uuid uuid={data.bonusUUID} />
      </div>
      {
        !!data.uuid &&
        <div className="font-size-11">
          {I18n.t('PLAYER_PROFILE.BONUS.CREATED_BY_CAMPAIGN')}
          <Uuid uuid={data.uuid} uuidPrefix="CA" />
        </div>
      }
      {
        !data.campaignUUID && !!data.operatorUUID &&
        <div className="font-size-11">
          {I18n.t('PLAYER_PROFILE.BONUS.CREATED_BY_OPERATOR')}
          <Uuid uuid={data.operatorUUID} uuidPrefix={data.operatorUUID.indexOf('OPERATOR') > -1 ? '' : 'OP'} />
        </div>
      }
    </div>
  );

  renderAvailablePeriod = data => (
    data.createdDate ? (
      <div>
        <div className="font-weight-700">
          {moment.utc(data.createdDate).local().format('DD.MM.YYYY HH:mm')}
        </div>
        {
          !!data.expirationDate &&
          <div className="font-size-11">
            {`${I18n.t('COMMON.TO')} ${moment.utc(data.expirationDate).local().format('DD.MM.YYYY HH:mm')}`}
          </div>
        }
      </div>
    ) : <span>&mdash;</span>
  );

  renderGrantedAmount = data => (
    <div>
      <Amount tag="div" className="font-weight-700" {...data.grantedAmount} />
      <div className="font-size-11">
        {I18n.t('PLAYER_PROFILE.BONUS.LOCKED_GRANTED')} <Amount {...data.initialLockedAmount} />
      </div>
    </div>
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
    <div>
      <Amount tag="div" {...data.toWager} />
      <div className="font-size-11">
        {I18n.t('PLAYER_PROFILE.BONUS.AMOUNT_TO_WAGE_PREPENDED_TEXT')} <Amount {...data.amountToWage} />
      </div>
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
      subTabRoutes,
    } = this.props;

    return (
      <div>
        <StickyNavigation links={subTabRoutes}>
          <button
            className="btn btn-sm btn-primary-outline"
            onClick={this.handleCreateManualBonusClick}
            id="add-manual-bonus-button"
          >
            {I18n.t('PLAYER_PROFILE.BONUS.MANUAL_BONUS_BUTTON')}
          </button>
        </StickyNavigation>

        <BonusGridFilter
          onSubmit={this.handleFiltersChanged}
        />

        <div className="tab-content">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            lazyLoad
            locale={locale}
            showNoResults={noResults}
          >
            <GridColumn
              name="mainInfo"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.BONUS')}
              render={this.renderMainInfo}
            />

            <GridColumn
              name="available"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.AVAILABLE')}
              render={this.renderAvailablePeriod}
            />

            <GridColumn
              name="granted"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.GRANTED')}
              render={this.renderGrantedAmount}
            />

            <GridColumn
              name="wagered"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.WAGERED')}
              render={this.renderWageredAmount}
            />

            <GridColumn
              name="toWager"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.TO_WAGER')}
              render={this.renderToWagerAmount}
            />

            <GridColumn
              name="type"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.BONUS_TYPE')}
              render={data => <BonusType bonus={data} />}
            />

            <GridColumn
              name="status"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.BONUS_STATUS')}
              render={data => <BonusStatus id="bonuses-list" bonus={data} />}
            />

            <GridColumn
              name="actions"
              header=""
              render={this.renderActions}
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
      </div>
    );
  }
}

export default View;
