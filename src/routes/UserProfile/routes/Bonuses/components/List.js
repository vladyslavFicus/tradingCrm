import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import BonusGridFilter from './BonusGridFilter';
import ViewModal from './ViewModal';
import moment from 'moment';
import Amount from 'components/Amount';
import { shortify } from 'utils/uuid';
import classNames from 'classnames';
import BonusType from "./BonusType";
import BonusStatus from "./BonusStatus";
import { statuses } from 'constants/bonus';
import { targetTypes } from 'constants/note';
import NoteButton from "../../../components/NoteButton";

const modalInitialState = { name: null, params: {} };
const VIEW_MODAL = 'view-modal';

class List extends Component {
  state = {
    modal: { ...modalInitialState },
    filters: {},
    page: 0,
  };

  static propTypes = {
    list: PropTypes.object,
    profile: PropTypes.object,
    accumulatedBalances: PropTypes.object,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
  };

  getNotePopoverParams = () => ({
    placement: 'left',
    onSubmitSuccess: () => {
      this.handleRefresh();
    },
    onDeleteSuccess: () => {
      this.handleRefresh();
    },
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

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  handleRefresh = () => {
    return this.props.fetchEntities({
      ...this.state.filters,
      page: this.state.page,
      playerUUID: this.props.params.id,
    });
  };

  componentWillMount() {
    this.handleRefresh();
  }

  handleSubmit = (filters) => {
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
      })
    }

    this.setState({
      modal: {
        name: VIEW_MODAL,
        params: {
          item: data,
          actions,
        },
      }
    })
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

  render() {
    const { modal } = this.state;
    const { list: { entities }, profile, accumulatedBalances } = this.props;

    return <div className={'tab-pane fade in active'}>
      <BonusGridFilter
        onSubmit={this.handleSubmit}
        initialValues={this.state.filters}
        playerUUID={profile.data.uuid}
      />

      <GridView
        tableClassName="table table-hovered"
        headerClassName=""
        dataSource={entities.content}
        onPageChange={this.handlePageChanged}
        activePage={entities.number + 1}
        totalPages={entities.totalPages}
      >
        <GridColumn
          name="mainInfo"
          header={"Bonus"}
          headerClassName={'text-uppercase'}
          render={this.renderMainInfo}
        />

        <GridColumn
          name="available"
          header={"Available"}
          headerClassName={'text-uppercase'}
          render={this.renderAvailablePeriod}
        />

        <GridColumn
          name="priority"
          header={"Priority"}
          headerClassName={'text-uppercase'}
        />

        <GridColumn
          name="granted"
          header={"Granted"}
          headerClassName={'text-uppercase'}
          render={this.renderGrantedAmount}
        />

        <GridColumn
          name="wagered"
          header={"Wagered"}
          headerClassName={'text-uppercase'}
          render={this.renderWageredAmount}
        />

        <GridColumn
          name="toWager"
          header={"To wager"}
          headerClassName={'text-uppercase'}
          render={this.renderToWagerAmount}
        />

        <GridColumn
          name="type"
          header={"Bonus type"}
          headerClassName={'text-uppercase'}
          render={(data) => <BonusType bonus={data}/>}
        />

        <GridColumn
          name="status"
          header={"Status"}
          headerClassName={'text-uppercase'}
          render={(data) => <BonusStatus bonus={data}/>}
        />

        <GridColumn
          name="actions"
          header={""}
          render={this.renderActions}
        />
      </GridView>

      {modal.name === VIEW_MODAL && <ViewModal
        isOpen={true}
        profile={profile}
        accumulatedBalances={accumulatedBalances}
        {...modal.params}
        onClose={this.handleModalClose}
      />}
    </div>;
  }

  renderMainInfo = (data) => {
    return <span>
      <span onClick={() => this.handleRowClick(data)} className="cursor-pointer font-weight-600">{data.label}</span>
      <br />
      <small className="text-muted">{shortify(data.bonusUUID, 'BM')}</small>
      <br/>
      {
        !!data.campaignUUID &&
        <small className="text-muted">
          by Campaign {shortify(data.campaignUUID, 'CO')}
        </small>
      }
      {
        !data.campaignUUID && !!data.operatorUUID &&
        <small className="text-muted">
          by Manual Bonus {shortify(data.operatorUUID, 'OP')}
        </small>
      }
    </span>;
  };

  renderAvailablePeriod = (data) => {
    return data.createdDate ? <div>
      <span className="font-weight-600">
        {moment(data.createdDate).format('DD.MM.YYYY HH:mm:ss')}
        </span>
      <br/>
      {
        !!data.expirationDate &&
        <small>
          {moment(data.expirationDate).format('DD.MM.YYYY HH:mm:ss')}
        </small>
      }
    </div> : <span>&mdash</span>;
  };

  renderGrantedAmount = (data) => {
    return <Amount className="font-weight-600" {...data.grantedAmount}/>;
  };

  renderWageredAmount = (data) => {
    const isCompleted = data.toWager && !isNaN(data.toWager.amount) && data.toWager.amount <= 0;

    return <Amount className={classNames({ 'font-weight-600 color-success': isCompleted })} {...data.wagered}/>;
  };

  renderToWagerAmount = (data) => {
    return <div>
      <Amount {...data.toWager}/><br />
      <small>out of <Amount {...data.amountToWage}/></small>
    </div>;
  };

  renderActions = (data) => {
    return <div>
      <NoteButton
        id={`bonus-item-note-button-${data.bonusUUID}`}
        className="cursor-pointer"
        onClick={(id) => this.handleNoteClick(id, data)}
      >
        {data.note
          ? <i className="fa fa-sticky-note"/>
          : <i className="fa fa-sticky-note-o"/>
        }
      </NoteButton>
    </div>;
  };
}

export default List;
