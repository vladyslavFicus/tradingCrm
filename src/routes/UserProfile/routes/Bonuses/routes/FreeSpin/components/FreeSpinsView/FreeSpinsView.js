import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { SubmissionError } from 'redux-form';
import FreeSpinMainInfo from '../FreeSpinMainInfo';
import PropTypes from '../../../../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../../../../components/GridView';
import { targetTypes } from '../../../../../../../../constants/note';
import { statuses } from '../../../../../../../../constants/free-spin';
import BonusHeaderNavigation from '../../../../components/BonusHeaderNavigation';
import Amount from '../../../../../../../../components/Amount';
import FreeSpinStatus from '../../../../../../../../components/FreeSpinStatus';
import NoteButton from '../../../../../../../../components/NoteButton';
import FreeSpinAvailablePeriod from '../FreeSpinAvailablePeriod';
import FreeSpinsFilterForm from '../FreeSpinsFilterForm';
import CreateModal from '../CreateModal';
import ViewModal from '../ViewModal';
import shallowEqual from '../../../../../../../../utils/shallowEqual';

const modalInitialState = { name: null, params: {} };
const MODAL_CREATE = 'create-modal';
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
    currency: PropTypes.string.isRequired,
    providers: PropTypes.arrayOf(PropTypes.string).isRequired,
    games: PropTypes.arrayOf(PropTypes.gameEntity).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    refreshPinnedNotes: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
    filters: {},
    page: 0,
  };

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
  }

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.onEditNoteClick(target, note, { placement: 'left' });
    } else {
      this.context.onAddNoteClick(data.uuid, targetTypes.FREE_SPIN)(target, { placement: 'left' });
    }
  };

  handleRefresh = () => {
    this.props.fetchFreeSpins({
      ...this.state.filters,
      page: this.state.page,
      playerUUID: this.props.params.id,
    });
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleFilterReset = () => {
    this.setState({ filters: {}, page: 0 });
  };

  handleRowClick = (data) => {
    const actions = [
      {
        children: I18n.t('COMMON.CLOSE'),
        onClick: this.handleModalClose,
        className: 'btn btn-default-outline text-uppercase',
      },
    ];

    if (data.status === statuses.ACTIVE) {
      actions.push({
        children: I18n.t('PLAYER_PROFILE.FREE_SPINS.CANCEL_FREE_SPIN'),
        onClick: this.handleCancelClick,
        className: 'btn btn-default-outline text-uppercase',
      });
    }

    this.handleModalOpen(MODAL_VIEW, {
      item: data,
      actions,
    });
  };

  handleCreateButtonClick = () => {
    this.handleModalOpen(MODAL_CREATE, {
      initialValues: {
        currencyCode: this.props.currency,
        playerUUID: this.props.params.id,
      },
    });
  };

  handleSubmitNewFreeSpin = async (data) => {
    const {
      createFreeSpin,
      resetNote,
      list: { newEntityNote: unsavedNote },
      fetchFilters,
    } = this.props;
    const action = await createFreeSpin(data);

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
      fetchFilters();
      this.handleModalClose(this.handleRefresh);
    }

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

  renderAvailable = data => (
    <FreeSpinAvailablePeriod freeSpin={data} />
  );

  renderGranted = data => (
    <div>
      <div className="font-weight-700">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.FREE_SPIN_COUNT', { count: data.freeSpinsAmount })}
      </div>
      <div className="font-size-10">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.SPIN_VALUE')}:&nbsp;
        <Amount {...data.spinValue} />
      </div>
      <div className="font-size-10">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.TOTAL_VALUE')}:&nbsp;
        <Amount {...data.totalValue} />
      </div>
    </div>
  );

  renderStatus = data => (
    <FreeSpinStatus freeSpin={data} />
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
      list: { entities, exporting, newEntityNote },
      filters: { data: { games: gamesFilterValues, providers: providersFilterValues } },
      providers,
      games,
      currency,
      manageNote,
    } = this.props;
    const allowActions = Object.keys(filters).filter(i => filters[i]).length > 0;

    return (
      <div className="tab-pane fade in active profile-tab-container">
        <div className="row margin-bottom-20">
          <div className="col-md-6">
            <BonusHeaderNavigation />
          </div>
          <div className="col-md-6 text-right">
            <button
              disabled={exporting || !allowActions}
              className="btn btn-default-outline margin-inline"
              onClick={this.handleExportButtonClick}
            >
              {I18n.t('PLAYER_PROFILE.FREE_SPINS.EXPORT_BUTTON')}
            </button>
            <button
              className="btn btn-primary-outline margin-inline"
              onClick={this.handleCreateButtonClick}
            >
              {I18n.t('PLAYER_PROFILE.FREE_SPINS.MANUAL_FREE_SPIN_BUTTON')}
            </button>
          </div>
        </div>

        <FreeSpinsFilterForm
          providers={providersFilterValues}
          games={gamesFilterValues}
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          initialValues={filters}
          disabled={!allowActions}
        />

        <GridView
          tableClassName="table table-hovered data-grid-layout"
          headerClassName=""
          dataSource={entities.content}
          onPageChange={this.handlePageChanged}
          activePage={entities.number + 1}
          totalPages={entities.totalPages}
        >
          <GridColumn
            name="freeSpin"
            header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.FREE_SPIN')}
            headerClassName="text-uppercase"
            render={this.renderFreeSpin}
          />
          <GridColumn
            name="availability"
            header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.AVAILABILITY')}
            headerClassName="text-uppercase"
            render={this.renderAvailable}
          />
          <GridColumn
            name="granted"
            header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.GRANTED')}
            headerClassName="text-uppercase"
            render={this.renderGranted}
          />
          <GridColumn
            name="status"
            header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.STATUS')}
            headerClassName="text-uppercase"
            render={this.renderStatus}
          />
          <GridColumn
            name="note"
            header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.NOTE')}
            render={this.renderNote}
          />
        </GridView>

        {
          modal.name === MODAL_CREATE &&
          <CreateModal
            isOpen
            {...modal.params}
            onSubmit={this.handleSubmitNewFreeSpin}
            onClose={this.handleModalClose}
            currency={currency}
            games={games}
            providers={providers}
            note={newEntityNote}
            onManageNote={manageNote}
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
