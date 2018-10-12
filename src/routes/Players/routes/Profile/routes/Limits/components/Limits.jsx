import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import CancelLimitModal from './CancelLimitModal';
import CreateLimitModal from './CreateLimitModal';
import CommonGridView from './CommonGridView';
import { targetTypes } from '../../../../../../../constants/note';
import { types, timeUnits } from '../../../../../../../constants/limits';
import PropTypes from '../../../../../../../constants/propTypes';
import TabHeader from '../../../../../../../components/TabHeader';

const CANCEL_LIMIT_MODAL = 'cancel-limit';
const CREATE_LIMIT_MODAL = 'create-limit';
const modalInitialState = {
  name: null,
  params: {},
};

class Limits extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    list: PropTypes.arrayOf(PropTypes.limitEntity),
    fetchEntities: PropTypes.func.isRequired,
    cancelLimit: PropTypes.func.isRequired,
    setLimit: PropTypes.func.isRequired,
    limitPeriods: PropTypes.limitPeriodEntity,
    locale: PropTypes.string.isRequired,
    paymentRegulationLimits: PropTypes.shape({
      regulationLimits: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.limitEntity),
      }),
    }),
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
  };
  static defaultProps = {
    list: [],
    paymentRegulationLimits: {},
    limitPeriods: null,
  };

  state = {
    modal: { ...modalInitialState },
  };

  componentDidMount() {
    const {
      context: {
        registerUpdateCacheListener,
        setNoteChangedCallback,
      },
      constructor: { name },
      handleRefresh,
    } = this;

    handleRefresh();
    setNoteChangedCallback(handleRefresh);
    registerUpdateCacheListener(name, handleRefresh);
  }

  componentWillUnmount() {
    const {
      context: {
        unRegisterUpdateCacheListener,
        setNoteChangedCallback,
      },
      constructor: { name },
    } = this;

    setNoteChangedCallback(null);
    unRegisterUpdateCacheListener(name);
  }

  handleRefresh = () => {
    const {
      fetchEntities,
      paymentRegulationLimits,
      match: { params: { id } },
    } = this.props;

    fetchEntities(id);
    paymentRegulationLimits.refetch();
  };

  handleCancelLimit = async (type, limitId) => {
    const {
      match: { params: { id } },
      cancelLimit,
      fetchEntities,
      cancelRegulationLimitMutation,
      notify,
    } = this.props;

    let error = false;

    if (type === types.REGULATION) {
      const response = await cancelRegulationLimitMutation({ variables: { playerUUID: id, uuid: limitId } });

      error = get(response, 'data.paymentLimit.cancel.error', false);
    } else {
      const response = await cancelLimit(id, type, limitId);

      ({ error } = response);

      if (response && !response.error) {
        fetchEntities(id);
      }
    }

    notify({
      level: !error ? 'success' : 'error',
      title: I18n.t('PLAYER_PROFILE.LIMITS.CANCEL_NOTIFICATION'),
    });

    if (!error) {
      this.handleCloseModal();
    }
  };

  handleCreateLimit = async (params) => {
    const {
      setLimit,
      fetchEntities,
      match: {
        params: {
          id,
        },
      },
      realBaseCurrency: {
        playerProfile: {
          data: {
            realMoneyBalance: {
              currency: currencyCode,
            },
          },
        },
      },
    } = this.props;
    const { type, period, amount, customPeriod } = params;

    const duration = period.split(' ');
    const data = {
      duration: customPeriod || duration.shift(),
      durationUnit: customPeriod ? timeUnits.HOURS : duration.shift(),
      currencyCode,
    };

    if ([types.WAGER, types.LOSS, types.DEPOSIT].indexOf(type) > -1) {
      data.amount = amount;
    }

    const action = await setLimit(id, type, data);
    this.handleCloseModal();

    if (action && !action.error) {
      fetchEntities(id);
    }
  };

  handleOpenCancelLimitModal = (e, name, params) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      modal: {
        name: CANCEL_LIMIT_MODAL,
        params,
      },
    });
  };

  handleOpenCreateLimitModal = (e, name, params) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      modal: {
        name: CREATE_LIMIT_MODAL,
        params,
      },
    });
  };

  handleCloseModal = (cb) => {
    this.setState({ modal: { ...modalInitialState } }, () => {
      if (typeof cb === 'function') {
        cb();
      }
    });
  };

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.onEditNoteClick(target, note, { placement: 'left' });
    } else {
      this.context.onAddNoteClick(data.uuid, targetTypes.LIMIT)(target, { placement: 'left' });
    }
  };

  render() {
    const { modal } = this.state;
    const {
      list,
      limitPeriods,
      locale,
      paymentRegulationLimits,
    } = this.props;

    const regulationLimits = get(paymentRegulationLimits, 'paymentRegulationLimits.data', []);

    return (
      <Fragment>
        <TabHeader title={I18n.t('PLAYER_PROFILE.LIMITS.REGULATION_TITLE')} />
        <div className="tab-wrapper">
          <CommonGridView
            dataSource={regulationLimits}
            onItemCancelClick={this.handleOpenCancelLimitModal}
            onNoteClick={this.handleNoteClick}
            locale={locale}
          />
        </div>
        <TabHeader title={I18n.t('PLAYER_PROFILE.LIMITS.TITLE')}>
          <button
            type="button"
            className="btn btn-sm btn-primary-outline"
            onClick={this.handleOpenCreateLimitModal}
          >
            {I18n.t('PLAYER_PROFILE.LIMITS.ADD_NEW_LIMIT')}
          </button>
        </TabHeader>
        <div className="tab-wrapper">
          <CommonGridView
            dataSource={list}
            onItemCancelClick={this.handleOpenCancelLimitModal}
            onNoteClick={this.handleNoteClick}
            locale={locale}
          />
        </div>
        {
          modal.name === CANCEL_LIMIT_MODAL &&
          <CancelLimitModal
            {...modal.params}
            onSubmit={this.handleCancelLimit}
            onClose={this.handleCloseModal}
            locale={locale}
          />
        }
        {
          modal.name === CREATE_LIMIT_MODAL &&
          <CreateLimitModal
            {...modal.params}
            initialValues={{
              type: types.DEPOSIT,
              period: limitPeriods.deposit[0],
            }}
            limitPeriods={limitPeriods}
            onSubmit={this.handleCreateLimit}
            onClose={this.handleCloseModal}
            isOpen
          />
        }
      </Fragment>
    );
  }
}

export default Limits;
