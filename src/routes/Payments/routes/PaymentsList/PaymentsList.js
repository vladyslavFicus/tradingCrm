import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get, set, cloneDeep } from 'lodash';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withRequests } from 'apollo';
import { TextRow } from 'react-placeholder/lib/placeholders';
import PropTypes from 'constants/propTypes';
import Placeholder from 'components/Placeholder';
import PaymentFilterFields from 'components/PaymentFilterFields';
import Grid, { GridColumn } from 'components/Grid';
import { columns } from 'utils/paymentHelpers';
import { PartnersQuery, PaymentsQuery } from './graphql';

class PaymentsList extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    payments: PropTypes.query({
      clientPayments: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentEntity),
        error: PropTypes.shape({
          error: PropTypes.any,
        }),
      }),
    }).isRequired,
    partners: PropTypes.query({
      partners: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.partner),
      }),
    }).isRequired,
  };

  static contextTypes = {
    notes: PropTypes.shape({
      setNoteChangedCallback: PropTypes.func.isRequired,
    }),
  };

  static childContextTypes = {
    getApolloRequestState: PropTypes.func.isRequired,
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
  }

  handleRefresh = () => {
    const {
      payments,
      location: { query },
    } = this.props;

    payments.refetch({
      ...(query && query.filters),
      requestId: Math.random().toString(36).slice(2),
      page: {
        from: 0,
        size: 20,
        sorts: (query && query.sorts) || [],
      },
    });
  };

  handleGetRequestState = () => this.props.payments.loading;

  handlePageChanged = () => {
    const {
      payments: {
        variables: { args },
        loadMore,
        data,
      },
    } = this.props;

    const page = get(data, 'clientPayments.data.number') || 0;

    loadMore(set({ args: cloneDeep(args) }, 'args.page.from', page + 1));
  };

  handleSort = (sortData) => {
    const { history } = this.props;
    const query = get(history, 'location.query') || {};

    const sorts = Object.keys(sortData)
      .filter(sortingKey => sortData[sortingKey])
      .map(sortingKey => ({
        column: sortingKey,
        direction: sortData[sortingKey],
      }));

    history.replace({
      query: {
        ...query,
        sorts,
      },
    });
  };

  render() {
    const {
      payments: { data: paymentsData, loading: paymentsLoading },
      partners: { data: partnersData, loading: partnersLoading },
    } = this.props;

    const partners = get(partnersData, 'partners.data') || [];
    const payments = get(paymentsData, 'clientPayments.data') || {
      content: [],
    };
    const paymentsError = get(paymentsData, 'clientPayments.error');

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!paymentsLoading}
            customPlaceholder={(
              <TextRow
                className="animated-background"
                style={{ width: '200px', height: '20px' }}
              />
            )}
          >
            <Choose>
              <When condition={payments && payments.totalElements}>
                <span className="font-size-20">
                  <strong>{payments.totalElements} </strong>
                  {I18n.t('COMMON.PAYMENTS')}
                </span>
              </When>
              <Otherwise>
                <span className="font-size-20">
                  {I18n.t('COMMON.PAYMENTS')}
                </span>
              </Otherwise>
            </Choose>
          </Placeholder>
        </div>

        <PaymentFilterFields
          partners={partners}
          partnersLoading={partnersLoading}
        />

        <div className="card-body">
          <Grid
            data={payments.content}
            handleSort={this.handleSort}
            handlePageChanged={this.handlePageChanged}
            isLoading={paymentsLoading}
            isLastPage={payments.last}
            withLazyLoad
            withNoResults={paymentsError}
          >
            {columns({
              paymentInfo: { onSuccess: this.handleRefresh },
            }).map(({ name, header, sortBy, render }) => (
              <GridColumn
                key={name}
                name={name}
                sortBy={sortBy}
                header={header}
                render={render}
              />
            ))}
          </Grid>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    partners: PartnersQuery,
    payments: PaymentsQuery,
  }),
)(PaymentsList);
