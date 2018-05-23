import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { SubmissionError } from 'redux-form';
import FreeSpinMainInfo from '../FreeSpinMainInfo';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../../../../../../components/GridView';
import { targetTypes } from '../../../../../../../../../../constants/note';
import { statuses, actions } from '../../../../../../../../../../constants/free-spin';
import Amount from '../../../../../../../../../../components/Amount';
import FreeSpinStatus from '../../../../../../../../../../components/FreeSpinStatus';
import NoteButton from '../../../../../../../../../../components/NoteButton';
import FreeSpinAvailablePeriod from '../FreeSpinAvailablePeriod';
import FreeSpinsFilterForm from '../FreeSpinsFilterForm';
import FreeSpinGameInfo from '../FreeSpinGameInfo';

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
      receivedAt: PropTypes.number,
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
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    locale: PropTypes.string.isRequired,
    fetchFreeSpinTemplates: PropTypes.func.isRequired,
    fetchFreeSpinTemplate: PropTypes.func.isRequired,
    createFreeSpinTemplate: PropTypes.func.isRequired,
    assignFreeSpinTemplate: PropTypes.func.isRequired,
    templates: PropTypes.arrayOf(PropTypes.freeSpinListEntity),
    modals: PropTypes.shape({
      freeSpinInfoModal: PropTypes.modalType,
      cancelFreeSpinModal: PropTypes.modalType,
      createFreeSpinModal: PropTypes.modalType,
      assignFreeSpinModal: PropTypes.modalType,
    }).isRequired,
  };
  static defaultProps = {
    templates: [],
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
    addNotification: PropTypes.func.isRequired,
    cacheChildrenComponent: PropTypes.func.isRequired,
    setRenderActions: PropTypes.func.isRequired,
  };

  state = {
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
    this.props.fetchFilters(this.props.match.params.id);

    this.context.setRenderActions(() => (
      <Fragment>
        <button
          disabled={this.props.list.exporting}
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
      </Fragment>
    ));
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
    this.context.cacheChildrenComponent(null);
    this.context.setRenderActions(null);
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
    const { match: { params: { id: playerUUID } }, fetchFreeSpins, fetchFilters } = this.props;

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
    const { modals: { freeSpinInfoModal } } = this.props;

    const modalActions = [];

    if ([statuses.CANCELED, statuses.PLAYED, statuses.FAILED].indexOf(item.status) === -1) {
      modalActions.push({
        children: I18n.t('PLAYER_PROFILE.FREE_SPINS.CANCEL_FREE_SPIN'),
        onClick: this.handleCancelClick(item),
        className: 'btn btn-danger',
      });
    }

    freeSpinInfoModal.show({
      playerUUID: item.playerUUID,
      uuid: item.uuid,
      note: item.note,
      actions: modalActions,
    });
  };

  handleCancelClick = item => () => {
    const {
      modals: { cancelFreeSpinModal },
      cancelReasons,
    } = this.props;

    cancelFreeSpinModal.show({
      item,
      action: actions.CANCEL,
      initialValues: {
        uuid: item.uuid,
      },
      reasons: cancelReasons,
      onSubmit: this.handleCancelFreeSpin,
    });
  };

  handleCreateButtonClick = () => {
    const { modals: { assignFreeSpinModal } } = this.props;

    assignFreeSpinModal.show({
      onSubmit: this.handleAssignFreeSpin,
    });
  };

  handleAssignFreeSpin = async (data) => {
    const {
      modals: { assignFreeSpinModal },
      match: { params: { id: playerUUID } },
      currency,
      assignFreeSpinTemplate,
    } = this.props;

    const { uuid, startDate, endDate } = data;

    const action = await assignFreeSpinTemplate(uuid, {
      playerUUID,
      currency,
      startDate,
      endDate,
    });

    if (action) {
      this.context.addNotification({
        title: I18n.t('PLAYER_PROFILE.FREE_SPINS.NOTIFICATIONS.ASSIGN_FREE_SPIN_TO_PLAYER'),
        message: action.error ? I18n.t('COMMON.ERROR') : I18n.t('COMMON.SUCCESS'),
        level: action.error ? 'error' : 'success',
      });

      if (action.error) {
        throw new SubmissionError({ _error: action.payload.response.error });
      } else {
        assignFreeSpinModal.hide({});
        this.handleRefresh();
      }
    }

    return action;
  };

  handleCancelFreeSpin = async ({ uuid, reason }) => {
    const {
      cancelFreeSpin,
      match: { params },
      modals: { createFreeSpinModal },
    } = this.props;
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

    createFreeSpinModal.hide();
    this.handleRefresh();

    return action;
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
    const { filters } = this.state;
    const {
      list: {
        entities, noResults,
      },
      filters: { data: { games: gamesFilterValues, providers: providersFilterValues } },
      locale,
    } = this.props;
    const allowActions = Object.keys(filters).filter(i => filters[i]).length > 0;

    return (
      <Fragment>
        <FreeSpinsFilterForm
          providers={providersFilterValues}
          games={gamesFilterValues}
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
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
              name="freeSpin"
              header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.FREE_SPIN')}
              render={this.renderFreeSpin}
            />
            <GridViewColumn
              name="game"
              header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.GAME')}
              render={this.renderGame}
            />
            <GridViewColumn
              name="availability"
              header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.AVAILABILITY')}
              render={this.renderAvailable}
            />
            <GridViewColumn
              name="granted"
              header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.GRANTED')}
              render={this.renderGranted}
            />
            <GridViewColumn
              name="status"
              header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.STATUS')}
              render={this.renderStatus}
            />
            <GridViewColumn
              name="note"
              header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.NOTE')}
              render={this.renderNote}
            />
          </GridView>
        </div>
      </Fragment>
    );
  }
}

export default FreeSpinsView;
