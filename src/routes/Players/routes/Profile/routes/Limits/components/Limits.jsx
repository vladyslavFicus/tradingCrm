import React, { Component, Fragment } from 'react';
import CancelLimitModal from './CancelLimitModal';
import CreateLimitModal from './CreateLimitModal';
import CommonGridView from './CommonGridView';
import { targetTypes } from '../../../../../../../constants/note';
import { types as limitTypes } from '../../../../../../../constants/limits';
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
  };
  static defaultProps = {
    list: [],
    limitPeriods: null,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
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

  handleRefresh = () => this.props.fetchEntities(this.props.match.params.id);

  handleCancelLimit = async (type, limitId) => {
    const { match: { params: { id } }, cancelLimit, fetchEntities } = this.props;

    const action = await cancelLimit(id, type, limitId);
    this.handleCloseModal();

    if (action && !action.error) {
      fetchEntities(id);
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
    const { type, period, amount } = params;

    const duration = period.split(' ');
    const data = {
      duration: duration.shift(),
      durationUnit: duration.shift(),
      currencyCode,
    };

    if ([limitTypes.WAGER, limitTypes.LOSS, limitTypes.DEPOSIT].indexOf(type) > -1) {
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
    const { list, limitPeriods, locale } = this.props;

    return (
      <Fragment>
        <TabHeader title="Limits">
          <button
            type="button"
            className="btn btn-sm btn-primary-outline"
            onClick={this.handleOpenCreateLimitModal}
          >
            + New limit
          </button>
        </TabHeader>
        <div className="tab-wrapper">
          <CommonGridView
            dataSource={list}
            onOpenCancelLimitModal={this.handleOpenCancelLimitModal}
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
              type: limitTypes.DEPOSIT,
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
