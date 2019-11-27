import React, { Component } from 'react';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { get, flatten } from 'lodash';
import I18n from 'i18n-js';
import { getActiveBrandConfig } from 'config';
import history from 'router/history';
import PropTypes from 'constants/propTypes';
import { withStorage } from 'providers/StorageProvider';
import { statusMapper } from 'constants/payment';
import Placeholder from 'components/Placeholder';
import ListFilterForm from 'components/ListFilterForm';
import GridView, { GridViewColumn } from 'components/GridView';
import { columns, filterFields } from 'utils/paymentHelpers';

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
    operators: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentOriginalAgent),
        error: PropTypes.object,
      }),
    }).isRequired,
    location: PropTypes.object.isRequired,
    auth: PropTypes.auth.isRequired,
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
    history.replace({});
  };

  render() {
    const {
      auth,
      clientPayments: {
        clientPayments,
        loading,
      },
      operators: {
        operators,
        loading: operatorsLoading,
      },
    } = this.props;

    const currencies = getActiveBrandConfig().currencies.supported;

    const entities = get(clientPayments, 'data') || { content: [] };
    const error = get(clientPayments, 'error');

    const originalAgents = get(operators, 'data.content') || [];
    const disabledOriginalAgentField = get(operators, 'error') || operatorsLoading;

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!loading && !!operators}
            className={null}
            customPlaceholder={(
              <TextRow className="animated-background" style={{ width: '200px', height: '20px' }} />
            )}
          >
            <Choose>
              <When condition={!!entities.totalElements}>
                <span className="font-size-20">
                  <strong>{entities.totalElements} </strong>
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

        <ListFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          initialValues={{ accountType: 'LIVE' }}
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
            showNoResults={!!error || (!loading && entities.content.length === 0)}
            loading={loading}
          >
            {columns({
              paymentInfo: { onSuccess: this.handleRefresh },
              playerInfo: { auth },
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

export default withStorage(['auth'])(View);
