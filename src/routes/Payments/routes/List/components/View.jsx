import React, { Component } from 'react';
import { get, flatten } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'constants/propTypes';
import { statusMapper } from 'constants/payment';
import GridView, { GridViewColumn } from 'components/GridView';
import history from 'router/history';
import { columns, filterFields } from 'utils/paymentHelpers';
import ListFilterForm from 'components/ListFilterForm';

class View extends Component {
  static propTypes = {
    onChangePaymentStatus: PropTypes.func.isRequired,
    resetAll: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    fetchPlayerMiniProfile: PropTypes.func.isRequired,
    auth: PropTypes.shape({
      brandId: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
    }).isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    clientPayments: PropTypes.shape({
      clientPayments: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentEntity),
        error: PropTypes.shape({
          error: PropTypes.any,
        }),
      }),
      loading: PropTypes.bool.isRequired,
      loadMore: PropTypes.func,
      refetch: PropTypes.func,
    }),
    operators: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentOriginalAgent),
        error: PropTypes.object,
      }),
    }).isRequired,
    location: PropTypes.object.isRequired,
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
  };

  static childContextTypes = {
    getApolloRequestState: PropTypes.func.isRequired,
  };

  static defaultProps = {
    clientPayments: {
      clientPayments: { content: [] },
      loading: false,
    },
  };

  getChildContext() {
    return {
      getApolloRequestState: this.handleGetRequestState,
    };
  }

  componentDidMount() {
    this.context.notes.setNoteChangedCallback(this.handleRefresh);
  }

  componentWillUnmount() {
    this.context.notes.setNoteChangedCallback(null);
    this.props.resetAll();
  }

  handleRefresh = () => this.props.clientPayments.refetch({
    ...this.props.location.query && this.props.location.query.filters,
    requestId: Math.random().toString(36).slice(2),
    page: 0,
    limit: 20,
  });

  handleGetRequestState = () => this.props.clientPayments.loading;

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
    const filters = { ...data };
    let statuses = null;

    if (Array.isArray(filters.statuses)) {
      statuses = flatten(filters.statuses.map(item => statusMapper[item]));
    }

    history.replace({
      query: {
        filters: {
          ...filters,
          ...statuses && { statuses },
        },
      },
    });
  };

  handleFilterReset = () => {
    this.props.resetAll();
    history.replace({});
  };

  // this probably will use in another place
  handleChangePaymentStatus = (action, playerUUID, paymentId, options = {}) => {
    const { onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({ action, playerUUID, paymentId, options })
      .then(this.handleRefresh)
      .then(this.handleCloseModal);
  };

  render() {
    const {
      locale,
      currencies,
      auth,
      fetchPlayerMiniProfile,
      clientPayments: {
        clientPayments,
        loading,
      },
      operators: {
        operators,
        loading: operatorsLoading,
      },
    } = this.props;

    const entities = get(clientPayments, 'data') || { content: [] };
    const error = get(clientPayments, 'error');

    const originalAgents = get(operators, 'data.content') || [];
    const disabledOriginalAgentField = get(operators, 'error') || operatorsLoading;

    return (
      <div className="card">
        <div className="card-heading">
          <span className="font-size-20" id="transactions-list-header">
            {I18n.t('COMMON.PAYMENTS')}
          </span>
        </div>

        <ListFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          fields={filterFields({
            currencies,
            originalAgents,
            disabledOriginalAgentField,
          })}
        />

        <div className="card-body">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            last={entities.last}
            lazyLoad
            locale={locale}
            showNoResults={!!error || (!loading && entities.content.length === 0)}
            loading={loading}
          >
            {columns({
              paymentInfo: { onSuccess: this.handleRefresh },
              playerInfo: { auth, fetchPlayer: fetchPlayerMiniProfile },
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
      </div>
    );
  }
}

export default View;
