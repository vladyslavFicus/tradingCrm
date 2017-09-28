import React, { Component } from 'react';
import moment from 'moment';
import TransactionsFilterForm from '../../../components/TransactionsFilterForm';
import PropTypes from '../../../../../constants/propTypes';
import Panel, { Title, Content } from '../../../../../components/Panel';
import GridView, { GridColumn } from '../../../../../components/GridView';
import {
  methodsLabels,
  typesLabels,
  typesProps,
} from '../../../../../constants/payment';
import PaymentDetailModal from '../../../../../components/PaymentDetailModal';
import PaymentActionReasonModal from '../../../../../components/PaymentActionReasonModal';
import TransactionStatus from '../../../../../components/TransactionStatus';
import { targetTypes } from '../../../../../constants/note';
import NoteButton from '../../../../../components/NoteButton';
import { UncontrolledTooltip } from '../../../../../components/Reactstrap/Uncontrolled';
import Uuid from '../../../../../components/Uuid';
import GridPlayerInfo from '../../../../../components/GridPlayerInfo';
import renderLabel from '../../../../../utils/renderLabel';
import GridPaymentInfo from '../../../../../components/GridPaymentInfo';
import GridPaymentAmount from '../../../../../components/GridPaymentAmount';
import PaymentAccount from '../../../../../components/PaymentAccount';
import IpFlag from '../../../../../components/IpFlag';

const MODAL_PAYMENT_DETAIL = 'payment-detail';
const MODAL_PAYMENT_ACTION_REASON = 'payment-action-reason';
const defaultModalState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    players: PropTypes.objectOf(PropTypes.userProfile).isRequired,
    transactions: PropTypes.pageableState(PropTypes.paymentEntity).isRequired,
    filters: PropTypes.shape({
      data: PropTypes.shape({
        paymentMethods: PropTypes.arrayOf(PropTypes.paymentMethod).isRequired,
      }).isRequired,
    }).isRequired,
    fetchEntities: PropTypes.func.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    fetchPlayerProfile: PropTypes.func.isRequired,
    loadPaymentStatuses: PropTypes.func.isRequired,
    onChangePaymentStatus: PropTypes.func.isRequired,
    resetAll: PropTypes.func.isRequired,
    paymentActionReasons: PropTypes.paymentActionReasons.isRequired,
    locale: PropTypes.string.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    exportEntities: PropTypes.func.isRequired,
    fetchPlayerMiniProfile: PropTypes.func.isRequired,
  };
  static contextTypes = {
    notes: PropTypes.shape({
      onAddNote: PropTypes.func.isRequired,
      onEditNote: PropTypes.func.isRequired,
      onAddNoteClick: PropTypes.func.isRequired,
      onEditNoteClick: PropTypes.func.isRequired,
      setNoteChangedCallback: PropTypes.func.isRequired,
      hidePopover: PropTypes.func.isRequired,
    }),
    addPanel: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
    page: 0,
    modal: { ...defaultModalState },
  };

  componentDidMount() {
    this.props.fetchFilters();
    this.context.notes.setNoteChangedCallback(this.handleRefresh);
  }

  componentWillUnmount() {
    this.context.notes.setNoteChangedCallback(null);
    this.props.resetAll();
  }

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.notes.onEditNoteClick(target, note, { placement: 'left' });
    } else {
      this.context.notes.onAddNoteClick(
        target,
        { playerUUID: data.playerUUID, targetUUID: data.paymentId, targetType: targetTypes.PAYMENT },
        { placement: 'left' }
      );
    }
  };

  handleRefresh = () => this.props.fetchEntities({
    ...this.state.filters,
    page: this.state.page,
  });

  handlePageChanged = (page) => {
    if (!this.props.transactions.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleFiltersChanged = (data = {}) => {
    const filters = { ...data };

    if (Array.isArray(filters.statuses)) {
      filters.statuses = filters.statuses.join(',');
    }

    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleFilterReset = () => {
    this.props.resetAll();
    this.setState({ filters: {}, page: 0 });
  };

  handleChangePaymentStatus = (action, playerUUID, paymentId, options = {}) => {
    const { onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({ action, playerUUID, paymentId, options })
      .then(this.handleRefresh)
      .then(this.handleCloseModal);
  };

  handleAskReason = (data) => {
    this.handleCloseModal();

    return this.handleOpenReasonModal({
      ...data,
      reasons: this.props.paymentActionReasons[data.action] || [],
    });
  };

  handleOpenReasonModal = (params) => {
    this.setState({
      modal: {
        ...defaultModalState,
        name: MODAL_PAYMENT_ACTION_REASON,
        params,
      },
    });
  };

  handleOpenDetailModal = async (params) => {
    const { players } = this.props;
    let playerProfile = players[params.payment.playerUUID];

    if (!playerProfile) {
      const action = await this.props.fetchPlayerProfile(params.payment.playerUUID);
      playerProfile = action && !action.error
        ? action.payload
        : null;
    }

    this.setState({
      modal: {
        ...defaultModalState,
        name: MODAL_PAYMENT_DETAIL,
        params: {
          ...params,
          playerProfile,
        },
      },
    });
  };

  handleCloseModal = (callback) => {
    this.setState({ modal: { ...defaultModalState } }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  handleExport = () => this.props.exportEntities({
    ...this.state.filters,
    page: this.state.page,
    playerUUID: this.props.params.id,
  });

  renderTransactionId = data => (
    <GridPaymentInfo
      payment={data}
      onClick={() => this.handleOpenDetailModal({ payment: data })}
    />
  );

  renderPlayer = (data) => {
    const { firstName, lastName, login, playerUUID } = data.playerProfile;

    const panelData = {
      fullName: `${firstName || '-'} ${lastName || '-'}`,
      login,
      uuid: playerUUID,
    };

    return data.playerProfile
      ? <GridPlayerInfo
        onClick={() => this.context.addPanel(panelData)}
        profile={data.playerProfile}
        id={`transaction-${data.paymentId}`}
        fetchPlayerProfile={this.props.fetchPlayerMiniProfile}
      />
      : <Uuid uuid={data.playerUUID} uuidPrefix={data.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null} />;
  };

  renderType = (data) => {
    const label = typesLabels[data.paymentType] || data.paymentType;
    const props = typesProps[data.paymentType] || {};

    return (
      <div>
        <div {...props}>{label}</div>
        <span className="font-size-11 text-uppercase">
          {data.paymentSystemRefs.map((SystemRef, index) => (
            <div key={`${SystemRef}-${index}`}>{SystemRef}</div>
          ))}
        </span>
      </div>
    );
  };

  renderAmount = data => <GridPaymentAmount payment={data} />;

  renderDateTime = data => (
    <div>
      <div className="font-weight-700">
        {moment.utc(data.creationTime).local().format('DD.MM.YYYY')}
      </div>
      <div className="font-size-11">
        {moment.utc(data.creationTime).local().format('HH:mm:ss')}
      </div>
    </div>
  );

  renderIP = (data) => {
    if (!data.country) {
      return data.country;
    }

    const id = `transaction-ip-${data.paymentId}`;

    return <IpFlag id={id} country={data.country} ip={data.clientIp} />;
  };

  renderMethod = data => (
    !data.paymentMethod ? <span>&mdash;</span>
      : <div>
        <div className="font-weight-700">
          {renderLabel(data.paymentMethod, methodsLabels)}
        </div>
        {
          !!data.paymentAccount &&
          <div className="font-size-11">
            <PaymentAccount account={data.paymentAccount} />
          </div>
        }
      </div>
  );

  renderDevice = (data) => {
    const id = `payment-device-${data.paymentId}`;

    return (
      <div>
        <i
          id={id}
          className={`fa font-size-20 ${data.mobile ? 'fa-mobile' : 'fa-desktop'}`}
        />
        <UncontrolledTooltip
          placement="bottom"
          target={id}
          delay={{
            show: 350,
            hide: 250,
          }}
        >
          {data.userAgent ? data.userAgent : 'User agent not defined'}
        </UncontrolledTooltip>
      </div>
    );
  };

  renderStatus = data => (
    <TransactionStatus
      onLoadStatusHistory={() => this.props.loadPaymentStatuses(data.playerUUID, data.paymentId)}
      transaction={data}
    />
  );

  renderActions = data => (
    <NoteButton
      id={`transaction-item-note-button-${data.paymentId}`}
      note={data.note}
      onClick={this.handleNoteClick}
      targetEntity={data}
    />
  );

  render() {
    const {
      transactions: { entities, noResults, exporting },
      filters: { data: availableFilters },
      locale,
    } = this.props;
    const { modal, filters } = this.state;
    const allowActions = Object.keys(filters).filter(i => filters[i]).length > 0;

    return (
      <div className="page-content-inner">
        <Panel withBorders>
          <Title>
            <div className="clearfix">
              <span className="font-size-20" id="transactions-list-header">
                Transactions
              </span>

              <button
                disabled={exporting || !allowActions}
                className="btn btn-default-outline pull-right"
                onClick={this.handleExport}
              >
                Export
              </button>
            </div>
          </Title>

          <TransactionsFilterForm
            onSubmit={this.handleFiltersChanged}
            onReset={this.handleFilterReset}
            disabled={!allowActions}
            {...availableFilters}
            filterByType
          />

          <Content>
            <GridView
              tableClassName="table table-hovered data-grid-layout"
              headerClassName="text-uppercase"
              dataSource={entities.content}
              onPageChange={this.handlePageChanged}
              activePage={entities.number + 1}
              totalPages={entities.totalPages}
              lazyLoad
              locale={locale}
              showNoResults={noResults}
            >
              <GridColumn
                name="paymentId"
                header="Transaction"
                render={this.renderTransactionId}
              />
              <GridColumn
                name="profile"
                header="Player"
                render={this.renderPlayer}
              />
              <GridColumn
                name="paymentType"
                header="Type"
                render={this.renderType}
              />
              <GridColumn
                name="amount"
                header="Amount"
                render={this.renderAmount}
              />
              <GridColumn
                name="creationTime"
                header="DATE & TIME"
                render={this.renderDateTime}
              />
              <GridColumn
                name="country"
                header="Ip"
                headerClassName="text-center"
                className="text-center"
                render={this.renderIP}
              />
              <GridColumn
                name="paymentMethod"
                header="Method"
                render={this.renderMethod}
              />
              <GridColumn
                name="mobile"
                header="Device"
                headerClassName="text-center"
                className="text-center"
                render={this.renderDevice}
              />
              <GridColumn
                name="status"
                header="Status"
                className="text-uppercase"
                render={this.renderStatus}
              />
              <GridColumn
                name="actions"
                header=""
                render={this.renderActions}
              />
            </GridView>

            {
              modal.name === MODAL_PAYMENT_DETAIL &&
              <PaymentDetailModal
                {...modal.params}
                isOpen
                onClose={this.handleCloseModal}
                onChangePaymentStatus={this.handleChangePaymentStatus}
                onAskReason={this.handleAskReason}
                onNoteClick={this.handleNoteClick}
              />
            }

            {
              modal.name === MODAL_PAYMENT_ACTION_REASON &&
              <PaymentActionReasonModal
                {...modal.params}
                onClose={this.handleCloseModal}
                onChangePaymentStatus={this.handleChangePaymentStatus}
                onNoteClick={this.handleNoteClick}
              />
            }
          </Content>
        </Panel>
      </div>
    );
  }
}

export default View;
