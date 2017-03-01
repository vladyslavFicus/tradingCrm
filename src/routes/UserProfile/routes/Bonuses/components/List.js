import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import BonusGridFilter from './BonusGridFilter';
import ViewModal from './ViewModal';
import {
  statuses,
  statusesLabels,
  statusesProps,
  typesLabels,
  typesProps,
} from 'constants/bonus';
import moment from 'moment';
import Amount from 'components/Amount';
import { shortify } from 'utils/uuid';
import './List.scss';

const modalInitialState = { name: null, params: {} };
const VIEW_MODAL = 'view-modal';

class List extends Component {
  state = {
    modal: { ...modalInitialState },
    filters: {},
    page: 0,
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

    if ([statuses.COMPLETED, statuses.CANCELLED, statuses.EXPIRED, statuses.CONSUMED].indexOf(data.state) === -1) {
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
      .then(() => this.handleRefresh());
  };

  render() {
    const { modal } = this.state;
    const { list: { entities }, profile, accumulatedBalances } = this.props;

    return <div className={'tab-pane fade in active bonus-list-tab'}>
      <BonusGridFilter
        onSubmit={this.handleSubmit}
        initialValues={this.state.filters}
        playerUUID={profile.data.uuid}
      />

      <GridView
        tableClassName="table table-responsive"
        headerClassName=""
        dataSource={entities.content}
        onPageChange={this.handlePageChanged}
        activePage={entities.number + 1}
        totalPages={entities.totalPages}
        onRowClick={this.handleRowClick}
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
          render={this.renderType}
        />

        <GridColumn
          name="status"
          header={"Status"}
          headerClassName={'text-uppercase'}
          render={this.renderStatus}
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
      <span className="font-weight-600 display-block">{data.label}</span>
      <small className="text-muted display-block">{shortify(data.bonusUUID, 'BM')}</small>
      {
        !!data.campaignUUID &&
        <small className="text-muted display-block">
          by Campaign {shortify(data.campaignUUID, 'CO')}
        </small>
      }
      {
        !data.campaignUUID && !!data.operatorUUID &&
        <small className="text-muted display-block">
          by Manual Bonus {shortify(data.operatorUUID, 'OP')}
        </small>
      }
    </span>;
  };

  renderAvailablePeriod = (data) => {
    return data.createdDate ? <div>
      <span className="font-weight-600 display-block">
        {moment(data.createdDate).format('DD.MM.YYYY HH:mm:ss')}
        </span>
      {
        !!data.expirationDate &&
        <small className="display-block">
          {moment(data.expirationDate).format('DD.MM.YYYY HH:mm:ss')}
        </small>
      }
    </div> : <span>&mdash</span>;
  };

  renderGrantedAmount = (data) => {
    return <Amount className="font-weight-600" {...data.grantedAmount}/>;
  };

  renderWageredAmount = (data) => {
    return <Amount className="font-weight-600" {...data.wagered}/>;
  };

  renderToWagerAmount = (data) => {
    const toWagerAmount = {
      amount: Math.max(
        data.amountToWage && !isNaN(data.amountToWage.amount) &&
        data.wagered && !isNaN(data.wagered.amount)
          ? data.amountToWage.amount - data.wagered.amount : 0,
        0
      ), currency: data.currency
    };

    return <div>
      <Amount className="display-block" {...toWagerAmount} />
      <small className="display-block">out of <Amount {...data.amountToWage}/></small>
    </div>;
  };

  renderType = (data) => {
    if (!data.bonusType) {
      return data.bonusType;
    }

    const label = typesLabels[data.bonusType] || data.bonusType;
    const props = typesProps[data.bonusType] || {};

    return <div>
      <span className="display-block" {...props}>{label}</span>
      <small className="display-block">{
        data.optIn
          ? 'Opt-in'
          : 'Non Opt-in'
      }</small>
    </div>;
  };

  renderStatus = (data) => {
    if (!data.state) {
      return data.state;
    }

    const label = statusesLabels[data.state] || data.state;
    const props = statusesProps[data.state] || {};

    return <div>
      <span {...props}>{label}</span><br/>
      {data.state === statuses.IN_PROGRESS && this.renderStatusActive(data)}
    </div>;
  };

  renderStatusActive = (data) => {
    return data.expirationDate
      ? <small>Until {moment(data.expirationDate).format('DD.MM.YYYY')}</small>
      : null;
  };

  renderActions = (data, column) => {

  };
}

export default List;
