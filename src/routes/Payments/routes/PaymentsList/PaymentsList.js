import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withRequests } from 'apollo';
import { TextRow } from 'react-placeholder/lib/placeholders';
import PropTypes from 'constants/propTypes';
import Placeholder from 'components/Placeholder';
import PaymentsListFilters from 'components/PaymentsListFilters';
import PaymentsListGrid from 'components/PaymentsListGrid';
import { PartnersQuery, PaymentsQuery } from './graphql';

class PaymentsList extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    paymentsQuery: PropTypes.query({
      clientPayments: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentEntity),
      }),
    }).isRequired,
    partnersQuery: PropTypes.query({
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

  handleGetRequestState = () => this.props.paymentsQuery.loading;

  handleRefresh = () => {
    const {
      paymentsQuery,
      location: { query },
    } = this.props;

    paymentsQuery.refetch({
      ...(query && query.filters),
      requestId: Math.random().toString(36).slice(2),
      page: {
        from: 0,
        size: 20,
        sorts: (query && query.sorts) || [],
      },
    });
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
      paymentsQuery,
      paymentsQuery: { data: paymentsData, loading: paymentsLoading },
      partnersQuery: { data: partnersData, loading: partnersLoading },
    } = this.props;

    const partners = get(partnersData, 'partners.data.content') || [];
    const payments = get(paymentsData, 'clientPayments.data');

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

        <PaymentsListFilters
          partners={partners}
          partnersLoading={partnersLoading}
          isGridLoading={paymentsLoading}
        />
        <PaymentsListGrid
          paymentsQuery={paymentsQuery}
          handleSort={this.handleSort}
          handleRefresh={this.handleRefresh}
        />
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    partnersQuery: PartnersQuery,
    paymentsQuery: PaymentsQuery,
  }),
)(PaymentsList);
