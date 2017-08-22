import React, { Component } from 'react';
import moment from 'moment';
import { SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import Sticky from 'react-stickynode';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../components/GridView';
import {
  types as paymentTypes,
  methodsLabels,
  typesLabels,
  typesProps,
} from '../../../../../constants/payment';
import TransactionStatus from '../../../../../components/TransactionStatus';
import { targetTypes } from '../../../../../constants/note';
import NoteButton from '../../../../../components/NoteButton';
import TransactionsFilterForm from './TransactionsFilterForm';
import PaymentDetailModal from '../../../../../components/PaymentDetailModal';
import PaymentActionReasonModal from '../../../../../components/PaymentActionReasonModal';
import PaymentAddModal from './PaymentAddModal';
import { UncontrolledTooltip } from '../../../../../components/Reactstrap/Uncontrolled';
import Uuid from '../../../../../components/Uuid';
import renderLabel from '../../../../../utils/renderLabel';
import GridPaymentInfo from '../../../../../components/GridPaymentInfo';
import GridPaymentAmount from '../../../../../components/GridPaymentAmount';

const MODAL_PAYMENT_DETAIL = 'payment-detail';
const MODAL_PAYMENT_ACTION_REASON = 'payment-action-reason';
const MODAL_PAYMENT_ADD = 'payment-add';
const defaultModalState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    transactions: PropTypes.pageableState(PropTypes.paymentEntity).isRequired,
    filters: PropTypes.shape({
      data: PropTypes.shape({
        paymentMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    }).isRequired,
    fetchEntities: PropTypes.func.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    resetAll: PropTypes.func.isRequired,
    loadPaymentStatuses: PropTypes.func.isRequired,
    onChangePaymentStatus: PropTypes.func.isRequired,
    loadPaymentAccounts: PropTypes.func.isRequired,
    addPayment: PropTypes.func.isRequired,
    manageNote: PropTypes.func.isRequired,
    resetNote: PropTypes.func.isRequired,
    currencyCode: PropTypes.string.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    newPaymentNote: PropTypes.noteEntity,
    playerProfile: PropTypes.userProfile.isRequired,
    paymentActionReasons: PropTypes.paymentActionReasons,
    walletLimits: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.walletLimitEntity).isRequired,
      deposit: PropTypes.shape({
        locked: PropTypes.bool.isRequired,
        canUnlock: PropTypes.bool.isRequired,
      }).isRequired,
      withdraw: PropTypes.shape({
        locked: PropTypes.bool.isRequired,
        canUnlock: PropTypes.bool.isRequired,
      }).isRequired,
      error: PropTypes.object,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number,
    }).isRequired,
    locale: PropTypes.string.isRequired,
  };
  static defaultProps = {
    newPaymentNote: null,
    paymentActionReasons: {},
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
    refreshPinnedNotes: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    cacheChildrenComponent: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
    page: 0,
    modal: defaultModalState,
  };

  componentWillMount() {
    this.context.cacheChildrenComponent(this);
  }

  async componentDidMount() {
    const {
      params: { id: playerUUID, paymentUUID },
      location,
      fetchFilters,
      fetchEntities,
      locationChange,
    } = this.props;

    fetchFilters(playerUUID);
    this.handleRefresh();
    this.context.setNoteChangedCallback(this.handleRefresh);

    if (paymentUUID) {
      const action = await fetchEntities(playerUUID, { keyword: paymentUUID });

      if (action && !action.error && action.payload.content.length > 0) {
        this.handleOpenDetailModal({
          payment: action.payload.content[0],
          onClose: () => {
            this.handleCloseModal();

            locationChange({ pathname: location.pathname.replace(`/${paymentUUID}`, '') });
          },
        });
      }
    }
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
    this.context.cacheChildrenComponent(null);
    this.props.resetAll();
  }

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.onEditNoteClick(target, note, { placement: 'left' });
    } else {
      this.context.onAddNoteClick(data.paymentId, targetTypes.PAYMENT)(target, { placement: 'left' });
    }
  };

  handleRefresh = () => this.props.fetchEntities(
    this.props.params.id, {
      ...this.state.filters,
      page: this.state.page,
    },
  );

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

  handleChangePaymentStatus = (action, playerUUID, paymentId, options = {}) => {
    const { onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({ action, playerUUID, paymentId, options })
      .then(this.handleRefresh)
      .then(this.handleCloseModal);
  };

  handleFilterReset = () => {
    this.props.resetAll();
    this.setState({ filters: {}, page: 0 });
  };

  handleAddPayment = async (inputParams) => {
    const {
      addPayment,
      params: { id: playerUUID },
      currencyCode,
      resetNote,
      newPaymentNote: unsavedNote,
    } = this.props;

    const params = {
      ...inputParams,
      currency: currencyCode,
    };

    if (inputParams.type !== paymentTypes.Withdraw) {
      delete params.paymentMethod;
    }

    const action = await addPayment(playerUUID, params);

    if (action && action.error) {
      throw new SubmissionError({ _error: action.payload.response.error });
    } else {
      if (unsavedNote) {
        await this.context.onAddNote({ ...unsavedNote, targetUUID: action.payload.paymentId });
        if (unsavedNote.pinned) {
          this.context.refreshPinnedNotes();
        }
      }

      resetNote();
      this.handleRefresh();
      this.handleCloseModal();
    }

    return action;
  };

  handleOpenAddPaymentModal = () => {
    this.setState({ modal: { name: MODAL_PAYMENT_ADD } });
  };

  handleAskReason = (data) => {
    this.handleCloseModal();

    return this.handleOpenReasonModal({
      ...data,
      reasons: this.props.paymentActionReasons[data.action] || {},
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

  handleOpenDetailModal = (params) => {
    this.setState({
      modal: {
        ...defaultModalState,
        name: MODAL_PAYMENT_DETAIL,
        params,
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

  renderTransactionId = data => (
    <GridPaymentInfo
      payment={data}
      onClick={() => this.handleOpenDetailModal({ payment: data })}
    />
  );

  renderType = (data) => {
    const label = typesLabels[data.paymentType] || data.paymentType;
    const props = typesProps[data.paymentType] || {};

    return (
      <div>
        <div {...props}> {label} </div>
        <div className="font-size-11 text-uppercase">
          {data.paymentSystemRefs.map((SystemRef, index) => (
            <div key={`${SystemRef}-${index}`}>{SystemRef}</div>
          ))}
        </div>
      </div>
    );
  };

  renderAmount = data => <GridPaymentAmount payment={data} />;

  renderDateTime = data => (
    <div>
      <div className="font-weight-700">
        {moment(data.creationTime).format('DD.MM.YYYY')}
      </div>
      <div className="font-size-11">
        {moment(data.creationTime).format('HH:mm:ss')}
      </div>
    </div>
  );

  renderIP = (data) => {
    if (!data.country) {
      return data.country;
    }

    const id = `payment-ip-${data.paymentId}`;

    return (
      <span>
        <i id={id} className={`fs-icon fs-${data.country.toLowerCase()}`} />
        <UncontrolledTooltip
          placement="bottom"
          target={id}
          delay={{
            show: 350,
            hide: 250,
          }}
        >
          {data.clientIp ? data.clientIp : I18n.t('COMMON.UNAVAILABLE')}
        </UncontrolledTooltip>
      </span>
    );
  };

  renderMethod = data => (
    !data.paymentMethod ? <span>&mdash;</span>
      : <div>
        <div className="font-weight-700">
          {renderLabel(data.paymentMethod, methodsLabels)}
        </div>
        {
          !!data.paymentAccount &&
          <span className="font-size-11">
            <Uuid uuid={data.paymentAccount} uuidPartsCount={2} />
          </span>
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
      id={`player-transaction-item-note-button-${data.paymentId}`}
      note={data.note}
      onClick={this.handleNoteClick}
      targetEntity={data}
    />
  );

  render() {
    const { modal } = this.state;
    const {
      transactions: { entities, noResults },
      filters: { data: availableFilters },
      loadPaymentAccounts,
      manageNote,
      playerProfile,
      newPaymentNote,
      walletLimits,
      locale,
    } = this.props;

    return (
      <div className="profile-tab-container">
        <Sticky top=".panel-heading-row" bottomBoundary={0}>
          <div className="tab-header">
            <div className="tab-header__heading">Transactions</div>
            <div className="tab-header__actions">
              <button className="btn btn-sm btn-primary-outline" onClick={this.handleOpenAddPaymentModal}>
                + Add transaction
              </button>
            </div>
          </div>
        </Sticky>

        <TransactionsFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          currencyCode={playerProfile.currencyCode}
          {...availableFilters}
        />

        <div className="tab-content">
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
              render={this.renderStatus}
            />
            <GridColumn
              name="actions"
              header=""
              render={this.renderActions}
            />
          </GridView>
        </div>
        {
          modal.name === MODAL_PAYMENT_DETAIL &&
          <PaymentDetailModal
            playerProfile={playerProfile}
            onClose={this.handleCloseModal}
            onChangePaymentStatus={this.handleChangePaymentStatus}
            onAskReason={this.handleAskReason}
            onNoteClick={this.handleNoteClick}
            {...modal.params}
          />
        }

        {
          modal.name === MODAL_PAYMENT_ACTION_REASON &&
          <PaymentActionReasonModal
            {...modal.params}
            onClose={this.handleCloseModal}
            onChangePaymentStatus={this.handleChangePaymentStatus}
            onNoteClick={this.handleNoteClick}
            onSubmit={this.handleChangePaymentStatus}
          />
        }

        {
          modal.name === MODAL_PAYMENT_ADD &&
          <PaymentAddModal
            {...modal.params}
            note={newPaymentNote}
            playerProfile={playerProfile}
            onClose={this.handleCloseModal}
            onLoadPaymentAccounts={() => loadPaymentAccounts(playerProfile.playerUUID)}
            onSubmit={this.handleAddPayment}
            onManageNote={manageNote}
            onNoteClick={this.handleNoteClick}
            walletLimits={walletLimits}
          />
        }
      </div>
    );
  }
}

export default View;
