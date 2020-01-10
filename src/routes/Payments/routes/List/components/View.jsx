import React, { Component } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import PropTypes from 'constants/propTypes';
import Placeholder from 'components/Placeholder';
import PaymentFilterFields from 'components/PaymentFilterFields';
import GridView, { GridViewColumn } from 'components/GridView';
import { columns } from 'utils/paymentHelpers';

class View extends Component {
  static propTypes = {
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
    partners: PropTypes.partnersList.isRequired,
    partnersLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
  };

  static defaultProps = {
    clientPayments: {
      clientPayments: { content: [] },
      loading: false,
    },
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
    const { clientPayments, location: { query } } = this.props;

    clientPayments.refetch({
      ...(query && query.filters),
      requestId: Math.random().toString(36).slice(2),
      page: 0,
      limit: 20,
    });
  };

  handleGetRequestState = () => this.props.clientPayments.loading;

  handlePageChanged = () => {
    const {
      clientPayments: { loadMore, loading },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  render() {
    const {
      clientPayments: {
        clientPayments,
        loading,
      },
      partners,
      partnersLoading,
    } = this.props;

    const payments = get(clientPayments, 'data') || { content: [] };
    const paymentsError = get(clientPayments, 'error');

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!loading}
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
          <GridView
            dataSource={payments.content}
            onPageChange={this.handlePageChanged}
            activePage={payments.number + 1}
            last={payments.last}
            lazyLoad
            showNoResults={paymentsError || (!loading && payments.content.length === 0)}
            loading={loading}
          >
            {columns({
              paymentInfo: { onSuccess: this.handleRefresh },
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
