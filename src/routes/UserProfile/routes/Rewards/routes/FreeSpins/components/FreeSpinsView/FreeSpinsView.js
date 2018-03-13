import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { SubmissionError } from 'redux-form';
import Sticky from 'react-stickynode';
import FreeSpinMainInfo from '../FreeSpinMainInfo';
import PropTypes from '../../../../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../../../../components/GridView';
import { targetTypes } from '../../../../../../../../constants/note';
import { statuses, actions } from '../../../../../../../../constants/free-spin';
import SubTabNavigation from '../../../../../../../../components/SubTabNavigation';
import Amount from '../../../../../../../../components/Amount';
import FreeSpinStatus from '../../../../../../../../components/FreeSpinStatus';
import NoteButton from '../../../../../../../../components/NoteButton';
import FreeSpinAvailablePeriod from '../FreeSpinAvailablePeriod';
import FreeSpinsFilterForm from '../FreeSpinsFilterForm';
import CreateModal from '../CreateModal';
import CancelModal from '../CancelModal';
import ViewModal from '../ViewModal';
import shallowEqual from '../../../../../../../../utils/shallowEqual';
import recognizeFieldError from '../../../../../../../../utils/recognizeFieldError';
import FreeSpinGameInfo from '../FreeSpinGameInfo';
import { aggregators, mapResponseErrorToField } from '../../constants';
import { moneyTypeUsage } from '../../../../../../../../constants/bonus';

const modalInitialState = { name: null, params: {} };
const MODAL_CREATE = 'create-modal';
const MODAL_CANCEL = 'cancel-modal';
const MODAL_VIEW = 'view-modal';

class FreeSpinsView extends Component {
  static propTypes = {
    list: PropTypes.shape({
      entities: PropTypes.pageable(PropTypes.freeSpinEntity),
      newEntityNote: PropTypes.noteEntity,
    }).isRequired,
    filters: PropTypes.shape({
      data: PropTypes.shape({
        games: PropTypes.arrayOf(PropTypes.string).isRequired,
        providers: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number.isRequired,
    }).isRequired,
    fetchFreeSpins: PropTypes.func.isRequired,
    exportFreeSpins: PropTypes.func.isRequired,
    createFreeSpin: PropTypes.func.isRequired,
    fetchGames: PropTypes.func.isRequired,
    manageNote: PropTypes.func.isRequired,
    resetNote: PropTypes.func.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    cancelFreeSpin: PropTypes.func.isRequired,
    currency: PropTypes.string.isRequired,
    providers: PropTypes.arrayOf(PropTypes.string).isRequired,
    cancelReasons: PropTypes.object.isRequired,
    games: PropTypes.arrayOf(PropTypes.gameEntity).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    locale: PropTypes.string.isRequired,
    fetchFreeSpinTemplates: PropTypes.func.isRequired,
    fetchFreeSpinTemplate: PropTypes.func.isRequired,
    createFreeSpinTemplate: PropTypes.func.isRequired,
    assignFreeSpinTemplate: PropTypes.func.isRequired,
    templates: PropTypes.arrayOf(PropTypes.freeSpinListEntity),
    subTabRoutes: PropTypes.subTabRoutes.isRequired,
  };
  static defaultProps = {
    templates: [],
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    refreshPinnedNotes: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
    addNotification: PropTypes.func.isRequired,
    cacheChildrenComponent: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
    filters: {},
    page: 0,
  };

  componentWillMount() {
    this.context.cacheChildrenComponent(this);
  }

  componentDidMount() {
    this.context.setNoteChangedCallback(this.handleRefresh);
    this.handleRefresh();
    this.props.fetchGames();
  }

  componentWillReceiveProps(nextProps) {
    const { modal: { name, params } } = this.state;

    if (name === MODAL_VIEW && params.item && params.item.uuid) {
      const nextItem = nextProps.list.entities.content.find(i => i.uuid === params.item.uuid);

      if (nextItem && !shallowEqual(nextItem, params.item)) {
        this.setState({ modal: { ...this.state.modal, params: { ...this.state.modal.params, item: nextItem } } });
      }
    }
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
    this.context.cacheChildrenComponent(null);
  }

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.onEditNoteClick(target, note, { placement: 'left' });
    } else {
      this.context.onAddNoteClick(data.uuid, targetTypes.FREE_SPIN)(target, { placement: 'left' });
    }
  };

  handlePageChanged = (page) => {
    this.setState({ page: page - 1 }, this.handleRefresh);
  };

  handleRefresh = () => {
    const { params: { id: playerUUID }, fetchFreeSpins, fetchFilters } = this.props;

    fetchFreeSpins({
      ...this.state.filters,
      page: this.state.page,
      playerUUID,
    })
      .then(() => fetchFilters(playerUUID));
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleFilterReset = () => {
    this.setState({ filters: {}, page: 0 }, this.handleRefresh);
  };

  handleRowClick = (item) => {
    const modalActions = [
      {
        children: I18n.t('COMMON.CLOSE'),
        onClick: this.handleModalClose,
        className: 'btn btn-default-outline',
      },
    ];

    if ([statuses.CANCELED, statuses.PLAYED, statuses.FAILED].indexOf(item.status) === -1) {
      modalActions.push({
        children: I18n.t('PLAYER_PROFILE.FREE_SPINS.CANCEL_FREE_SPIN'),
        onClick: this.handleCancelClick(item),
        className: 'btn btn-danger',
      });
    }

    this.handleModalOpen(MODAL_VIEW, {
      item,
      actions: modalActions,
    });
  };

  handleCancelClick = item => () => {
    this.handleModalOpen(MODAL_CANCEL, {
      item,
      action: actions.CANCEL,
      initialValues: {
        uuid: item.uuid,
      },
    });
  };

  handleCreateButtonClick = () => {
    this.handleModalOpen(MODAL_CREATE, {
      initialValues: {
        currencyCode: this.props.currency,
        playerUUID: this.props.params.id,
        moneyTypePriority: moneyTypeUsage.REAL_MONEY_FIRST,
      },
    });
  };

  handleSubmitNewFreeSpin = async (data) => {
    const { aggregatorId, startDate, endDate } = data;

    const {
      createFreeSpin,
      createFreeSpinTemplate,
      assignFreeSpinTemplate,
      resetNote,
      currency,
      params: { id: playerUUID },
      list: { newEntityNote: unsavedNote },
    } = this.props;

    let action;
    if (aggregatorId === aggregators.igromat) {
      const { moduleId, clientId, betPerLine, ...freeSpinTemplateData } = data;
      action = await createFreeSpinTemplate({
        claimable: false,
        ...freeSpinTemplateData,
        betPerLineAmounts: [
          {
            amount: betPerLine,
            currency,
          },
        ],
      });

      if (action && !action.error) {
        const { uuid } = action.payload;
        await assignFreeSpinTemplate(uuid, {
          playerUUID,
          currency,
          startDate,
          endDate,
        });
      } else if (action.error && action.payload.response) {
        if (action.payload.response.fields_errors) {
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
    } else {
      action = await createFreeSpin(data);
    }

    if (action && action.error) {
      throw new SubmissionError({ _error: action.payload.response.error });
    } else {
      if (unsavedNote) {
        await this.context.onAddNote({ ...unsavedNote, targetUUID: action.payload.uuid });
        if (unsavedNote.pinned) {
          this.context.refreshPinnedNotes();
        }
      }

      resetNote();
      this.handleModalClose(this.handleRefresh);
    }

    return action;
  };

  handleCancelFreeSpin = async ({ uuid, reason }) => {
    const { cancelFreeSpin, params } = this.props;
    const action = await cancelFreeSpin(params.id, uuid, reason);

    if (action) {
      if (action.error) {
        this.context.addNotification({
          title: I18n.t('COMMON.ERROR'),
          message: I18n.t('PLAYER_PROFILE.FREE_SPINS.NOTIFICATIONS.CANCEL_FREE_SPIN_ERROR'),
          level: 'error',
        });
      } else {
        this.handleRefresh();
      }
    }

    this.handleModalClose(this.handleRefresh);

    return action;
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

  handleExportButtonClick = () => this.props.exportFreeSpins({
    ...this.state.filters,
    page: this.state.page,
  });

  renderFreeSpin = data => (
    <FreeSpinMainInfo freeSpin={data} onClick={this.handleRowClick} />
  );

  renderGame = data => (
    <FreeSpinGameInfo freeSpin={data} />
  );

  renderAvailable = data => (
    <FreeSpinAvailablePeriod freeSpin={data} />
  );

  renderGranted = data => (
    <div>
      <div className="font-weight-700">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.FREE_SPIN_COUNT', { count: data.freeSpinsAmount })}
      </div>
      <div className="font-size-11">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.SPIN_VALUE')}:&nbsp;
        <Amount {...data.spinValue} />
      </div>
      <div className="font-size-11">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.TOTAL_VALUE')}:&nbsp;
        <Amount {...data.totalValue} />
      </div>
    </div>
  );

  renderStatus = data => (
    <FreeSpinStatus id={`free-spin-status-${data.uuid}-grid`} freeSpin={data} />
  );

  renderNote = data => (
    <NoteButton
      id={`profile-bonus-free-spin-${data.uuid}`}
      note={data.note}
      onClick={this.handleNoteClick}
      targetEntity={data}
    />
  );

  render() {
    const { modal, filters } = this.state;
    const {
      list: { entities, exporting, newEntityNote, noResults },
      filters: { data: { games: gamesFilterValues, providers: providersFilterValues } },
      providers,
      games,
      currency,
      manageNote,
      cancelReasons,
      locale,
      fetchFreeSpinTemplates,
      fetchFreeSpinTemplate,
      templates,
      subTabRoutes,
    } = this.props;
    const allowActions = Object.keys(filters).filter(i => filters[i]).length > 0;

    return (
      <div>
        <Sticky top=".panel-heading-row" bottomBoundary={0} innerZ="2">
          <div className="tab-header">
            <SubTabNavigation links={subTabRoutes} />
            <div className="tab-header__actions">
              <button
                disabled={exporting || !allowActions}
                className="btn btn-default-outline btn-sm"
                onClick={this.handleExportButtonClick}
              >
                {I18n.t('PLAYER_PROFILE.FREE_SPINS.EXPORT_BUTTON')}
              </button>
              <button
                className="btn btn-primary-outline margin-left-15 btn-sm"
                onClick={this.handleCreateButtonClick}
              >
                {I18n.t('PLAYER_PROFILE.FREE_SPINS.MANUAL_FREE_SPIN_BUTTON')}
              </button>
            </div>
          </div>
        </Sticky>

        <FreeSpinsFilterForm
          providers={providersFilterValues}
          games={gamesFilterValues}
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
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
              name="freeSpin"
              header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.FREE_SPIN')}
              render={this.renderFreeSpin}
            />
            <GridColumn
              name="game"
              header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.GAME')}
              render={this.renderGame}
            />
            <GridColumn
              name="availability"
              header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.AVAILABILITY')}
              render={this.renderAvailable}
            />
            <GridColumn
              name="granted"
              header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.GRANTED')}
              render={this.renderGranted}
            />
            <GridColumn
              name="status"
              header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.STATUS')}
              render={this.renderStatus}
            />
            <GridColumn
              name="note"
              header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.NOTE')}
              render={this.renderNote}
            />
          </GridView>
        </div>
        {
          modal.name === MODAL_CREATE &&
          <CreateModal
            {...modal.params}
            onSubmit={this.handleSubmitNewFreeSpin}
            onClose={this.handleModalClose}
            currency={currency}
            games={games}
            providers={providers}
            note={newEntityNote}
            onManageNote={manageNote}
            templates={templates}
            fetchFreeSpinTemplates={fetchFreeSpinTemplates}
            fetchFreeSpinTemplate={fetchFreeSpinTemplate}
          />
        }
        {
          modal.name === MODAL_CANCEL &&
          <CancelModal
            {...modal.params}
            onSubmit={this.handleCancelFreeSpin}
            onClose={this.handleModalClose}
            reasons={cancelReasons}
          />
        }
        {
          modal.name === MODAL_VIEW &&
          <ViewModal
            isOpen
            {...modal.params}
            onClose={this.handleModalClose}
          />
        }
      </div>
    );
  }
}

export default FreeSpinsView;
