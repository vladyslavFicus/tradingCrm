import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { shortify } from '../../../../../utils/uuid';
import Amount from '../../../../../components/Amount';
import GridView, { GridColumn } from '../../../../../components/GridView';
import BonusGridFilter from './BonusGridFilter';
import ViewModal from './ViewModal';
import BonusType from './BonusType';
import BonusStatus from './BonusStatus';
import { statuses } from '../../../../../constants/bonus';
import { targetTypes } from '../../../../../constants/note';
import NoteButton from '../../../../../components/NoteButton';

const modalInitialState = { name: null, params: {} };
const VIEW_MODAL = 'view-modal';

class List extends Component {
  static propTypes = {
    list: PropTypes.object,
    profile: PropTypes.object,
    accumulatedBalances: PropTypes.object,
    fetchEntities: PropTypes.func.isRequired,
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

  handleRefresh = () => {
    return this.props.fetchEntities({
      ...this.state.filters,
      page: this.state.page,
      playerUUID: this.props.params.id,
    });
  };

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
        children: 'Close',
        onClick: this.handleModalClose,
        className: 'btn btn-default-outline text-uppercase',
      },
    ];

    if ([statuses.INACTIVE, statuses.IN_PROGRESS].indexOf(data.state) > -1) {
      actions.push({
        children: 'Cancel bonus',
        onClick: this.handleCancelBonus.bind(null, data.id),
        className: 'btn btn-danger text-uppercase',
      });
    }

    this.setState({
      modal: {
        name: VIEW_MODAL,
        params: {
          item: data,
          actions,
        },
      },
    });
  };

  handleModalClose = () => {
    this.setState({ modal: { ...modalInitialState } });
  };

  handleCancelBonus = (id) => {
    this.props.cancelBonus(id, this.props.params.id)
      .then(() => {
        this.handleModalClose();
        this.handleRefresh();
      });
  };

  renderMainInfo = (data) => {
    return (
      <div>
        <div className="font-weight-600 cursor-pointer" onClick={() => this.handleRowClick(data)}>{data.label}</div>
        <div className="text-muted font-size-10">{shortify(data.bonusUUID, 'BM')}</div>
        {
          !!data.campaignUUID &&
          <div className="text-muted font-size-10">
            by Campaign {shortify(data.campaignUUID, 'CO')}
          </div>
        }
        {
          !data.campaignUUID && !!data.operatorUUID &&
          <div className="text-muted font-size-10">
            by Manual Bonus {shortify(data.operatorUUID, 'OP')}
          </div>
        }
      </div>
    );
  };

  renderAvailablePeriod = (data) => {
    return data.createdDate ? <div>
        <div className="font-weight-600">
          {moment(data.createdDate).format('DD.MM.YYYY HH:mm:ss')}
        </div>
        {
          !!data.expirationDate &&
          <div className="font-size-10">
            {moment(data.expirationDate).format('DD.MM.YYYY HH:mm:ss')}
          </div>
        }
      </div> : <span>&mdash</span>;
  };

  renderGrantedAmount = (data) => {
    return <Amount tag="div" className="font-weight-600" {...data.grantedAmount} />;
  };

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

  renderToWagerAmount = (data) => {
    return (
      <div>
        <Amount tag="div" {...data.toWager} />
        <div className="font-size-10">
          out of <Amount {...data.amountToWage} />
        </div>
      </div>
    );
  };

  renderActions = (data) => {
    return (
      <div>
        <NoteButton
          id={`bonus-item-note-button-${data.bonusUUID}`}
          className="cursor-pointer"
          onClick={id => this.handleNoteClick(id, data)}
        >
          <i
            className={classNames('fa', {
              'fa-sticky-note': !!data.note,
              'fa-sticky-note-o': !data.note,
            })}
          />
        </NoteButton>
      </div>
    );
  };

  render() {
    const { modal, filters } = this.state;
    const { list: { entities }, profile, accumulatedBalances } = this.props;

    return (
      <div className={'tab-pane fade in active profile-tab-container'}>
        <BonusGridFilter
          onSubmit={this.handleSubmit}
          initialValues={filters}
          playerUUID={profile.data.uuid}
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
            header="Bonus"
            headerClassName={'text-uppercase'}
            render={this.renderMainInfo}
          />

          <GridColumn
            name="available"
            header="Available"
            headerClassName={'text-uppercase'}
            render={this.renderAvailablePeriod}
          />

          <GridColumn
            name="priority"
            header="Priority"
            headerClassName={'text-uppercase'}
          />

          <GridColumn
            name="granted"
            header="Granted"
            headerClassName={'text-uppercase'}
            render={this.renderGrantedAmount}
          />

          <GridColumn
            name="wagered"
            header="Wagered"
            headerClassName={'text-uppercase'}
            render={this.renderWageredAmount}
          />

          <GridColumn
            name="toWager"
            header="To wager"
            headerClassName={'text-uppercase'}
            render={this.renderToWagerAmount}
          />

          <GridColumn
            name="type"
            header="Bonus type"
            headerClassName={'text-uppercase'}
            render={data => <BonusType bonus={data} />}
          />

          <GridColumn
            name="status"
            header="Status"
            headerClassName={'text-uppercase'}
            render={data => <BonusStatus bonus={data} />}
          />

          <GridColumn
            name="actions"
            header=""
            render={this.renderActions}
          />
        </GridView>

        {modal.name === VIEW_MODAL && <ViewModal
          isOpen
          profile={profile}
          accumulatedBalances={accumulatedBalances}
          {...modal.params}
          onClose={this.handleModalClose}
        />}
      </div>
    );
  }
}

export default List;
