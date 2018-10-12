import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import moment from 'moment';
import { SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../../../../../components/GridView';
import {
  types as paymentTypes,
  methodsLabels,
  typesLabels,
  customTypesProps,
  customTypes,
  customTypesLabels,
  typesProps,
} from '../../../../../../../../../constants/payment';
import TransactionStatus from '../../../../../../../../../components/TransactionStatus';
import NoteButton from '../../../../../../../../../components/NoteButton';
import TransactionsFilterForm from './TransactionsFilterForm';
import PaymentDetailModal from '../../../../../../../../../components/PaymentDetailModal';
import PaymentActionReasonModal from '../../../../../../../../../components/PaymentActionReasonModal';
import PaymentAddModal from './PaymentAddModal';
import { UncontrolledTooltip } from '../../../../../../../../../components/Reactstrap/Uncontrolled';
import renderLabel from '../../../../../../../../../utils/renderLabel';
import GridPaymentInfo from '../../../../../../../../../components/GridPaymentInfo';
import GridPaymentAmount from '../../../../../../../../../components/GridPaymentAmount';
import IpFlag from '../../../../../../../../../components/IpFlag';
import history from '../../../../../../../../../router/history';
import getFingerprint from '../../../../../../../../../utils/fingerPrint';

const MODAL_PAYMENT_DETAIL = 'payment-detail';
const MODAL_PAYMENT_ACTION_REASON = 'payment-action-reason';
const MODAL_PAYMENT_ADD = 'payment-add';
const defaultModalState = {
  name: null,
  params: {},
};

class Payments extends Component {
  static propTypes = {
    transactions: PropTypes.pageableState(PropTypes.paymentEntity).isRequired,
    filters: PropTypes.shape({
      data: PropTypes.shape({
        paymentMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
        statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    operatorPaymentMethods: PropTypes.shape({
      operatorPaymentMethods: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.shape({
          uuid: PropTypes.string,
          methodName: PropTypes.string,
        })),
      }),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    newPaymentNote: PropTypes.noteEntity,
    playerProfile: PropTypes.userProfile.isRequired,
    paymentActionReasons: PropTypes.paymentActionReasons,
    playerLimits: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.playerLimitEntity).isRequired,
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
    fetchActiveBonus: PropTypes.func.isRequired,
    exportEntities: PropTypes.func.isRequired,
  };
  static defaultProps = {
    newPaymentNote: null,
    paymentActionReasons: {},
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    setRenderActions: PropTypes.func.isRequired,
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
    page: 0,
    modal: defaultModalState,
  };

  async componentDidMount() {
    const {
      context: {
        registerUpdateCacheListener,
        setNoteChangedCallback,
        setRenderActions,
      },
      constructor: { name },
      handleRefresh,
      handleOpenDetailModal,
      handleCloseModal,
      handleOpenAddPaymentModal,
      props: {
        match: { params: { id: playerUUID, paymentUUID } },
        fetchFilters,
        fetchEntities,
        location,
      },
    } = this;

    handleRefresh();
    registerUpdateCacheListener(name, handleRefresh);
    fetchFilters(playerUUID);
    setNoteChangedCallback(handleRefresh);

    if (paymentUUID) {
      const action = await fetchEntities(playerUUID, { keyword: paymentUUID });

      if (action && !action.error && action.payload.content.length > 0) {
        handleOpenDetailModal({
          payment: action.payload.content[0],
          onClose: () => {
            handleCloseModal();
            history.replace(location.pathname.replace(`/${paymentUUID}`, ''));
          },
        });
      }
    }

    setRenderActions(() => this.renderPaymentActions(handleOpenAddPaymentModal));
  }

  componentWillUnmount() {
    const {
      context: {
        unRegisterUpdateCacheListener,
        setNoteChangedCallback,
        setRenderActions,
      },
      constructor: { name },
      props: { resetAll },
    } = this;

    resetAll();
    setRenderActions(null);
    setNoteChangedCallback(null);
    unRegisterUpdateCacheListener(name);
  }

  handleNoteClick = (target, note, data) => {
    const { onEditNoteClick, onAddNoteClick } = this.context;

    if (note) {
      onEditNoteClick(target, note, { placement: 'left' });
    } else {
      onAddNoteClick(data.paymentId)(target, {
        placement: 'left',
        id: data.paymentId,
      });
    }
  };

  handleRefresh = () => this.props.fetchEntities(this.props.match.params.id, {
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

  handleChangePaymentStatus = (action, playerUUID, paymentId, options = {}) => {
    const { onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({
      action, playerUUID, paymentId, options,
    })
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
      match: { params: { id: playerUUID } },
      currencyCode,
      createWithdraw,
      resetNote,
      createDeposit,
      transactions: { newPaymentNote: unsavedNote },
      fetchActiveBonus,
    } = this.props;
    const params = {
      ...inputParams,
      currency: currencyCode,
    };
    let paymentId = '';

    if (inputParams.type === paymentTypes.DEPOSIT_BY_PAYMENT_METHOD) {
      const deposit = await createDeposit({
        variables: {
          playerUUID,
          ...params,
          device: await getFingerprint(),
        },
      });
      const { data, error } = get(deposit, 'data.payment.createDeposit', { data: null, error: null });

      if (error) {
        throw new SubmissionError({ _error: [error.error], ...(error.fields_errors || {}) });
      } else {
        const a = document.createElement('a');

        a.href = data.redirectLink;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        paymentId = data.paymentId;
      }
    } else if (inputParams.type === paymentTypes.WITHDRAW_BY_PAYMENT_METHOD) {
      const withdraw = await createWithdraw({
        variables: {
          playerUUID,
          ...params,
          device: await getFingerprint(),
        },
      });
      const { error, data } = get(withdraw, 'data.payment.createWithdraw', { data: null, error: null });

      if (error) {
        throw new SubmissionError({ _error: [error.error], ...(error.fields_errors || {}) });
      } else {
        paymentId = data.paymentId;
      }
    } else {
      if (inputParams.type !== paymentTypes.Withdraw) {
        delete params.paymentMethod;
      }

      const action = await addPayment(playerUUID, params);

      if (action && action.error) {
        const errors = [action.payload.response.error];

        if (
          inputParams.type === paymentTypes.Confiscate &&
          action.payload.response.error === 'error.payment.withdrawable.limit'
        ) {
          const activeBonusAction = await fetchActiveBonus(playerUUID);

          if (activeBonusAction && !activeBonusAction.error && activeBonusAction.payload.totalElements) {
            errors.push('error.payment.withdrawable.bonus.disable');
          }
        }

        throw new SubmissionError({ _error: errors });
      } else {
        paymentId = action.payload.paymentId;
      }
    }

    if (unsavedNote) {
      await this.context.onAddNote({
        variables: {
          ...unsavedNote,
          targetUUID: paymentId,
          playerUUID,
        },
      });
    }

    resetNote();
    this.handleRefresh();
    this.handleCloseModal();
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

  handleExport = () => this.props.exportEntities(
    this.props.match.params.id, {
      ...this.state.filters,
    }
  );

  renderTransactionId = data => (
    <GridPaymentInfo
      payment={data}
      onClick={() => this.handleOpenDetailModal({ payment: data })}
    />
  );

  renderType = data => (
    <Fragment>
      <Choose>
        <When condition={data.transactionTag && data.transactionTag !== customTypes.NORMAL}>
          <div {...customTypesProps[data.transactionTag]}>{renderLabel(data.transactionTag, customTypesLabels)}</div>
        </When>
        <Otherwise>
          <div {...typesProps[data.paymentType]}>{renderLabel(data.paymentType, typesLabels)}</div>
        </Otherwise>
      </Choose>
      <div className="font-size-11 text-uppercase">
        {data.paymentSystemRefs.map((SystemRef, index) => (
          <div key={`${SystemRef}-${index}`}>{SystemRef}</div>
        ))}
      </div>
    </Fragment>
  );

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

    const id = `payment-ip-${data.paymentId}`;

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
          <span className="font-size-11">
            {data.paymentAccount}
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

  renderPaymentActions = (handleOpenAddPaymentModal) => {
    const { filters } = this.state;
    const allowActions = Object.keys(filters).filter(i => filters[i]).length > 0;

    return (
      <Fragment>
        <button
          type="button"
          disabled={!allowActions}
          className="btn btn-sm btn-default-outline mr-2"
          onClick={this.handleExport}
        >
          {I18n.t('CONSTANTS.TRANSACTIONS.ACTIONS.EXPORT_TRANSACTIONS')}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-primary-outline"
          onClick={handleOpenAddPaymentModal}
        >
          {I18n.t('CONSTANTS.TRANSACTIONS.ACTIONS.ADD_TRANSACTION')}
        </button>
      </Fragment>
    );
  };

  render() {
    const { modal } = this.state;
    const {
      transactions: { entities, noResults, newPaymentNote },
      filters: { data: availableFilters },
      operatorPaymentMethods,
      loadPaymentAccounts,
      manageNote,
      playerProfile,
      playerLimits,
      locale,
    } = this.props;

    const paymentMethods = get(operatorPaymentMethods, 'operatorPaymentMethods.data', []) || [];

    return (
      <Fragment>
        <TransactionsFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          currencyCode={playerProfile.currencyCode}
          {...availableFilters}
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
              name="paymentId"
              header="Transaction"
              render={this.renderTransactionId}
            />
            <GridViewColumn
              name="paymentType"
              header="Type"
              render={this.renderType}
            />
            <GridViewColumn
              name="amount"
              header="Amount"
              render={this.renderAmount}
            />
            <GridViewColumn
              name="creationTime"
              header="DATE & TIME"
              render={this.renderDateTime}
            />
            <GridViewColumn
              name="country"
              header="Ip"
              headerClassName="text-center"
              className="text-center"
              render={this.renderIP}
            />
            <GridViewColumn
              name="paymentMethod"
              header="Method"
              render={this.renderMethod}
            />
            <GridViewColumn
              name="mobile"
              header="Device"
              headerClassName="text-center"
              className="text-center"
              render={this.renderDevice}
            />
            <GridViewColumn
              name="status"
              header="Status"
              render={this.renderStatus}
            />
            <GridViewColumn
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
            paymentMethods={paymentMethods}
            playerProfile={playerProfile}
            onClose={this.handleCloseModal}
            onLoadPaymentAccounts={() => loadPaymentAccounts(playerProfile.playerUUID)}
            onSubmit={this.handleAddPayment}
            onManageNote={manageNote}
            playerLimits={playerLimits}
          />
        }
      </Fragment>
    );
  }
}

export default Payments;
