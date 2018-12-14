import React, { Component } from 'react';
import { get, flatten, omitBy, isEmpty } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import { statusMapper } from '../../../../../constants/payment';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import history from '../../../../../router/history';
import { columns } from '../../../../../utils/paymentHelpers';
import fields from './filterFields';
import ListFilterForm from '../../../../../components/ListFilterForm';

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

  static defaultProps = {
    clientPayments: {
      clientPayments: { content: [] },
      loading: false,
    },
  };

  componentDidMount() {
    this.context.notes.setNoteChangedCallback(this.handleRefresh);
  }

  componentWillUnmount() {
    this.context.notes.setNoteChangedCallback(null);
    this.props.resetAll();
  }

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
    const filters = omitBy({ ...data }, isEmpty);
    let statuses = null;

    if (Array.isArray(filters.statuses) && filters.statuses.length > 0) {
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

  handleModalActionSuccess = () => this.props.clientPayments.refetch();

  render() {
    const {
      locale,
      currencies,
      clientPayments,
      auth,
      fetchPlayerMiniProfile,
    } = this.props;

    const entities = get(clientPayments, 'clientPayments.data') || { content: [] };
    const error = get(clientPayments, 'clientPayments.error');

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
          fields={fields(currencies)}
        />

        <div className="card-body">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            last={entities.last}
            lazyLoad
            locale={locale}
            showNoResults={!!error || (!clientPayments.loading && entities.content.length === 0)}
          >
            {columns({
              paymentInfo: { onSuccess: this.handleModalActionSuccess },
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
