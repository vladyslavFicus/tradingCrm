import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import Sticky from 'react-stickynode';
import PropTypes from '../../../../../../../../constants/propTypes';
import Amount from '../../../../../../../../components/Amount';
import NoteButton from '../../../../../../../../components/NoteButton';
import GridView, { GridColumn } from '../../../../../../../../components/GridView';
import { statuses } from '../../../../../../../../constants/bonus';
import { targetTypes } from '../../../../../../../../constants/note';
import Uuid from '../../../../../../../../components/Uuid';
import BonusHeaderNavigation from '../../../../components/BonusHeaderNavigation';
import BonusGridFilter from '../BonusGridFilter';
import ViewModal from '../ViewModal';
import BonusType from '../BonusType';
import BonusStatus from '../BonusStatus';
import CreateModal from '../CreateModal/CreateModal';
import shallowEqual from '../../../../../../../../utils/shallowEqual';

const modalInitialState = { name: null, params: {} };
const MODAL_CREATE = 'create-modal';
const MODAL_VIEW = 'view-modal';

class View extends Component {
  static propTypes = {
    list: PropTypes.pageableState(PropTypes.bonusEntity).isRequired,
    playerProfile: PropTypes.shape({ data: PropTypes.userProfile }).isRequired,
    fetchEntities: PropTypes.func.isRequired,
    createBonus: PropTypes.func.isRequired,
    cancelBonus: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    fetchActiveBonus: PropTypes.func.isRequired,
    acceptBonus: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
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
    const { canClaimBonus, fetchActiveBonus } = this.props;
    const actions = [
      {
        children: I18n.t('COMMON.CLOSE'),
        onClick: this.handleModalClose,
        className: 'btn btn-default-outline text-uppercase',
      },
    ];

    if (canClaimBonus && data.state === statuses.INACTIVE) {
      const activeBonusAction = await fetchActiveBonus(this.props.params.id);
      if (activeBonusAction && !activeBonusAction.error && activeBonusAction.payload.content.length === 0) {
        actions.push({
          children: I18n.t('PLAYER_PROFILE.BONUS.CLAIM_BONUS'),
          onClick: this.handleClaimBonus.bind(null, data.id),
          className: 'btn btn-primary text-uppercase',
        });
      }
    }

    if ([statuses.INACTIVE, statuses.IN_PROGRESS].indexOf(data.state) > -1) {
      actions.push({
        children: I18n.t('PLAYER_PROFILE.BONUS.CANCEL_BONUS'),
        onClick: this.handleCancelBonus.bind(null, data.id),
        className: 'btn btn-danger text-uppercase',
        id: `${data.state.toLowerCase().split('_').join('-')}-bonus-cancel-button`,
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

  handleClaimBonus = (id) => {
    this.props.acceptBonus(id, this.props.params.id)
      .then(() => {
        this.handleModalClose(this.handleRefresh);
      });
  };

  handleCancelBonus = (id) => {
    this.props.cancelBonus(id, this.props.params.id)
      .then(() => {
        this.handleModalClose(this.handleRefresh);
      });
  };

  handleCreateManualBonusClick = () => {
    this.handleModalOpen(MODAL_CREATE);
  };

  handleSubmitManualBonus = async (data) => {
    const action = await this.props.createBonus(data);

    if (!action || action.error) {
      throw new SubmissionError({ _error: I18n.t('PLAYER_PROFILE.BONUS.MANUAL_CREATION_FAILURE') });
    }

    this.handleModalClose(this.handleRefresh);

    return action;
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
          {moment(data.createdDate).format('DD.MM.YYYY HH:mm:ss')}
        </div>
        {
          !!data.expirationDate &&
          <div className="font-size-11">
            {moment(data.expirationDate).format('DD.MM.YYYY HH:mm:ss')}
          </div>
        }
      </div>
    ) : <span>&mdash;</span>
  );

  renderGrantedAmount = data => <Amount tag="div" className="font-weight-700" {...data.grantedAmount} />;

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
    } = this.props;

    return (
      <div className="profile-tab-container">
        <Sticky top=".panel-heading-row" bottomBoundary={0} innerZ="1">
          <div className="tab-header">
            <BonusHeaderNavigation />
            <div className="tab-header__actions">
              <button
                className="btn btn-sm btn-primary-outline"
                onClick={this.handleCreateManualBonusClick}
                id="add-manual-bonus-button"
              >
                {I18n.t('PLAYER_PROFILE.BONUS.MANUAL_BONUS_BUTTON')}
              </button>
            </div>
          </div>
        </Sticky>

        <BonusGridFilter
          onSubmit={this.handleFiltersChanged}
        />

        <div className="tab-content">
          <GridView
            tableClassName="table table-hovered data-grid-layout"
            headerClassName="text-uppercase"
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
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
              name="priority"
              header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.PRIORITY')}
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
          modal.name === MODAL_CREATE &&
          <CreateModal
            initialValues={{
              playerUUID: playerProfile.playerUUID,
              state: 'INACTIVE',
              currency: playerProfile.currencyCode,
            }}
            onSubmit={this.handleSubmitManualBonus}
            onClose={this.handleModalClose}
          />
        }
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
