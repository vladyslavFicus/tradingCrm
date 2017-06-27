import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { shortify } from '../../../../../../../../utils/uuid';
import Amount from '../../../../../../../../components/Amount';
import GridView, { GridColumn } from '../../../../../../../../components/GridView';
import { statuses } from '../../../../../../../../constants/bonus';
import { targetTypes } from '../../../../../../../../constants/note';
import PopoverButton from '../../../../../../../../components/PopoverButton';
import Uuid from '../../../../../../../../components/Uuid';
import BonusHeaderNavigation from '../../../../components/BonusHeaderNavigation';
import BonusGridFilter from '../BonusGridFilter';
import ViewModal from '../ViewModal';
import BonusType from '../BonusType';
import BonusStatus from '../BonusStatus';
import CreateModal from '../CreateModal/CreateModal';

const modalInitialState = { name: null, params: {} };
const MODAL_CREATE = 'create-modal';
const MODAL_VIEW = 'view-modal';

class View extends Component {
  static propTypes = {
    list: PropTypes.object,
    profile: PropTypes.object,
    accumulatedBalances: PropTypes.object,
    fetchEntities: PropTypes.func.isRequired,
    createBonus: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    cancelBonus: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
    filters: {},
    page: 0,
  };

  componentWillMount() {
    this.handleRefresh();
  }

  componentDidMount() {
    this.context.setNoteChangedCallback(this.handleRefresh);
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
  }

  getNotePopoverParams = () => ({
    placement: 'left',
  });

  handleNoteClick = (target, data) => {
    if (data.note) {
      this.context.onEditNoteClick(target, data.note, this.getNotePopoverParams());
    } else {
      this.context.onAddNoteClick(data.bonusUUID, targetTypes.BONUS)(target, this.getNotePopoverParams());
    }
  };

  handlePageChanged = (page) => {
    this.setState({ page: page - 1 }, () => this.handleRefresh());
  };

  handleRefresh = () => this.props.fetchEntities({
    ...this.state.filters,
    page: this.state.page,
    playerUUID: this.props.params.id,
  });

  handleSubmit = (inputFilters = {}) => {
    const filters = inputFilters;

    if (filters.states) {
      filters.states = [filters.states];
    }

    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  handleRowClick = (data) => {
    const actions = [
      {
        children: I18n.t('COMMON.CLOSE'),
        onClick: this.handleModalClose,
        className: 'btn btn-default-outline text-uppercase',
      },
    ];

    if ([statuses.INACTIVE, statuses.IN_PROGRESS].indexOf(data.state) > -1) {
      actions.push({
        children: I18n.t('PLAYER_PROFILE.BONUS.CANCEL_BONUS'),
        onClick: this.handleCancelBonus.bind(null, data.id),
        className: 'btn btn-danger text-uppercase',
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

  handleCancelBonus = (id) => {
    this.props.cancelBonus(id, this.props.params.id)
      .then(() => {
        this.handleModalClose();
        this.handleRefresh();
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
      <div className="font-weight-600 cursor-pointer" onClick={() => this.handleRowClick(data)}>
        {data.label}
      </div>
      <div className="text-muted font-size-10">{shortify(data.bonusUUID)}</div>
      {
        !!data.campaignUUID &&
        <div className="text-muted font-size-10">
          {I18n.t('PLAYER_PROFILE.BONUS.CREATED_BY_CAMPAIGN')}
          <Uuid uuid={data.campaignUUID} uuidPrefix="CA" />
        </div>
      }
      {
        !data.campaignUUID && !!data.operatorUUID &&
        <div className="text-muted font-size-10">
          {I18n.t('PLAYER_PROFILE.BONUS.CREATED_BY_OPERATOR')}
          <Uuid uuid={data.operatorUUID} uuidPrefix={data.operatorUUID.indexOf('OPERATOR') > -1 ? '' : 'OP'} />
        </div>
      }
    </div>
  );

  renderAvailablePeriod = data => data.createdDate ? (
    <div>
      <div className="font-weight-600">
        {moment(data.createdDate).format('DD.MM.YYYY HH:mm:ss')}
      </div>
      {
        !!data.expirationDate &&
        <div className="font-size-10">
          {moment(data.expirationDate).format('DD.MM.YYYY HH:mm:ss')}
        </div>
      }
    </div>
  ) : <span>&mdash</span>;

  renderGrantedAmount = data => <Amount tag="div" className="font-weight-600" {...data.grantedAmount} />;

  renderWageredAmount = (data) => {
    const isCompleted = data.toWager && !isNaN(data.toWager.amount) && data.toWager.amount <= 0;

    return (
      <Amount
        tag="div"
        className={classNames({ 'font-weight-600 color-success': isCompleted })}
        {...data.wagered}
      />
    );
  };

  renderToWagerAmount = data => (
    <div>
      <Amount tag="div" {...data.toWager} />
      <div className="font-size-10">
        {I18n.t('PLAYER_PROFILE.BONUS.AMOUNT_TO_WAGE_PREPENDED_TEXT')} <Amount {...data.amountToWage} />
      </div>
    </div>
  );

  renderActions = data => (
    <div>
      <PopoverButton
        id={`bonus-item-note-button-${data.bonusUUID}`}
        className="cursor-pointer"
        onClick={id => this.handleNoteClick(id, data)}
      >
        <i
          className={classNames('note-icon', {
            'note-with-text': data.note && !data.note.pinned,
            'note-pinned-note': data.note && data.note.pinned,
            'note-add-note': !data.note,
          })}
        />
      </PopoverButton>
    </div>
  );

  render() {
    const { modal, filters } = this.state;
    const { list: { entities }, profile, accumulatedBalances } = this.props;

    return (
      <div className="tab-pane fade in active profile-tab-container">
        <div className="row margin-bottom-20">
          <div className="col-md-6 col-xs-6">
            <BonusHeaderNavigation />
          </div>
          <div className="col-md-6 col-xs-6 text-right">
            <button className="btn btn-sm btn-primary-outline" onClick={this.handleCreateManualBonusClick}>
              {I18n.t('PLAYER_PROFILE.BONUS.MANUAL_BONUS_BUTTON')}
            </button>
          </div>
        </div>

        <BonusGridFilter
          onSubmit={this.handleSubmit}
          initialValues={filters}
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
            name="mainInfo"
            header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.BONUS')}
            headerClassName={'text-uppercase'}
            render={this.renderMainInfo}
          />

          <GridColumn
            name="available"
            header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.AVAILABLE')}
            headerClassName={'text-uppercase'}
            render={this.renderAvailablePeriod}
          />

          <GridColumn
            name="priority"
            header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.PRIORITY')}
            headerClassName={'text-uppercase'}
          />

          <GridColumn
            name="granted"
            header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.GRANTED')}
            headerClassName={'text-uppercase'}
            render={this.renderGrantedAmount}
          />

          <GridColumn
            name="wagered"
            header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.WAGERED')}
            headerClassName={'text-uppercase'}
            render={this.renderWageredAmount}
          />

          <GridColumn
            name="toWager"
            header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.TO_WAGER')}
            headerClassName={'text-uppercase'}
            render={this.renderToWagerAmount}
          />

          <GridColumn
            name="type"
            header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.BONUS_TYPE')}
            headerClassName={'text-uppercase'}
            render={data => <BonusType bonus={data} />}
          />

          <GridColumn
            name="status"
            header={I18n.t('PLAYER_PROFILE.BONUS.GRID_VIEW.BONUS_STATUS')}
            headerClassName={'text-uppercase'}
            render={data => <BonusStatus bonus={data} />}
          />

          <GridColumn
            name="actions"
            header=""
            render={this.renderActions}
          />
        </GridView>

        {
          modal.name === MODAL_CREATE &&
          <CreateModal
            isOpen
            initialValues={{ playerUUID: profile.data.uuid, state: 'INACTIVE', currency: profile.data.currencyCode }}
            onSubmit={this.handleSubmitManualBonus}
            onClose={this.handleModalClose}
          />
        }
        {
          modal.name === MODAL_VIEW &&
          <ViewModal
            isOpen
            profile={profile}
            accumulatedBalances={accumulatedBalances}
            {...modal.params}
            onClose={this.handleModalClose}
          />
        }
      </div>
    );
  }
}

export default View;
