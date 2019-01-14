import React, { Component, Fragment } from 'react';
import { SubmissionError } from 'redux-form';
import { get, flatten } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../../../../../components/GridView';
import { targetTypes } from '../../../../../../../../../constants/note';
import { statusMapper } from '../../../../../../../../../constants/payment';
import history from '../../../../../../../../../router/history';
import { columns, filterFields } from '../../../../../../../../../utils/paymentHelpers';
import ListFilterForm from '../../../../../../../../../components/ListFilterForm';

class Payments extends Component {
  static propTypes = {
    filters: PropTypes.shape({
      data: PropTypes.shape({
        paymentMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
        statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    }).isRequired,
    fetchProfile: PropTypes.func.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    resetAll: PropTypes.func.isRequired,
    auth: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
    }).isRequired,
    currencyCode: PropTypes.string,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    playerProfile: PropTypes.userProfile,
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
    addPayment: PropTypes.func.isRequired,
    clientPayments: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      loadMore: PropTypes.func.isRequired,
      clientPaymentsByUuid: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentEntity),
        error: PropTypes.object,
      }),
    }).isRequired,
    operators: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentOriginalAgent),
        error: PropTypes.object,
      }),
    }).isRequired,
    modals: PropTypes.shape({
      addPayment: PropTypes.modalType,
    }).isRequired,
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

  static defaultProps = {
    currencyCode: null,
    playerProfile: {},
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
      handleOpenAddPaymentModal,
      props: {
        match: { params: { id: playerUUID } },
        fetchFilters,
      },
    } = this;

    handleRefresh();
    registerUpdateCacheListener(name, handleRefresh);
    fetchFilters(playerUUID);
    setNoteChangedCallback(handleRefresh);

    setRenderActions(() => (
      <button className="btn btn-sm btn-primary-outline" onClick={handleOpenAddPaymentModal}>
        {I18n.t('PLAYER_PROFILE.TRANSACTIONS.ADD_TRANSACTION')}
      </button>
    ));
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
    if (note) {
      this.context.onEditNoteClick(target, note, { placement: 'left' });
    } else {
      this.context.onAddNoteClick(data.paymentId, targetTypes.PAYMENT)(target, {
        placement: 'left',
        id: data.paymentId,
      });
    }
  };

  handleRefresh = () => this.props.clientPayments.refetch();

  handlePageChanged = () => {
    const {
      clientPayments: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleFiltersChanged = (data = {}) => {
    let statuses = null;

    if (Array.isArray(data.statuses)) {
      statuses = flatten(data.statuses.map(item => statusMapper[item]));
    }

    history.replace({
      query: {
        filters: {
          ...data,
          ...statuses && { statuses },
        },
      },
    });
  };

  handleFilterReset = () => {
    this.props.resetAll();
    history.replace({});
  };

  handleAddPayment = async (data) => {
    const { note, ...inputParams } = data;

    const {
      addPayment,
      addNote,
      match: { params: { id: uuid } },
      currencyCode,
      clientPayments: { refetch },
      playerProfile: {
        country,
        languageCode: language,
        firstName,
        lastName,
      },
      fetchProfile,
      modals: { addPayment: modal },
    } = this.props;

    const variables = {
      ...inputParams,
      language,
      currency: currencyCode,
      playerProfile: {
        country,
        firstName,
        lastName,
        uuid,
      },
    };
    const { data: { payment: { createClientPayment: { data: payment, error } } } } = await addPayment({ variables });

    if (error) {
      throw new SubmissionError({ _error: [error] });
    } else {
      if (note) {
        await addNote({ variables: { ...note, targetUUID: payment.paymentId } });
      }

      await Promise.all([
        refetch(),
        fetchProfile(uuid),
      ]);

      modal.hide();
    }
  };

  handleOpenAddPaymentModal = () => {
    const {
      modals: { addPayment },
      playerProfile,
    } = this.props;

    addPayment.show({
      onSubmit: this.handleAddPayment,
      playerProfile,
    });
  };

  handleModalActionSuccess = () => this.props.clientPayments.refetch();

  render() {
    const {
      locale,
      clientPayments: {
        loading,
        clientPaymentsByUuid,
      },
      auth,
      operators: {
        operators,
        loading: operatorsLoading,
      },
    } = this.props;

    const entities = get(clientPaymentsByUuid, 'data') || { content: [] };
    const error = get(clientPaymentsByUuid, 'error');

    const originalAgents = get(operators, 'data.content') || [];
    const disabledOriginalAgentField = get(operators, 'error') || operatorsLoading;

    return (
      <Fragment>
        <ListFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          fields={filterFields(
            {
              originalAgents,
              disabledOriginalAgentField,
            },
            true,
          )}
        />

        <div className="tab-wrapper">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            last={entities.last}
            lazyLoad
            locale={locale}
            showNoResults={!!error || (!loading && entities.content.length === 0)}
          >
            {columns({
              paymentInfo: { onSuccess: this.handleModalActionSuccess },
              playerInfo: { auth },
              clientView: true,
            }).map(({ name, header, render }) => (
              <GridViewColumn
                key={name}
                name={name}
                header={header}
                render={render}
              />
            ))}
          </GridView>
        </div>
      </Fragment>
    );
  }
}

export default Payments;
