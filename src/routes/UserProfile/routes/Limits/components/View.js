import React, { Component } from 'react';
import CancelLimitModal from './CancelLimitModal';
import CreateLimitModal from './CreateLimitModal';
import CommonGridView from './CommonGridView';
import { targetTypes } from '../../../../../constants/note';
import { types as limitTypes } from '../../../../../constants/limits';
import PropTypes from '../../../../../constants/propTypes';

const CANCEL_LIMIT_MODAL = 'cancel-limit';
const CREATE_LIMIT_MODAL = 'create-limit';
const modalInitialState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    list: PropTypes.arrayOf(PropTypes.limitEntity),
    fetchEntities: PropTypes.func.isRequired,
    cancelLimit: PropTypes.func.isRequired,
    setLimit: PropTypes.func.isRequired,
    limitPeriods: PropTypes.limitPeriodEntity,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
  };

  componentDidMount() {
    this.handleRefresh();
    this.context.setNoteChangedCallback(this.handleRefresh);
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
  }

  handleRefresh = () => {
    return this.props.fetchEntities(this.props.params.id);
  };

  handleCancelLimit = async (type, limitId) => {
    const { params: { id }, cancelLimit, fetchEntities } = this.props;

    const action = await cancelLimit(id, type, limitId);
    this.handleCloseModal();

    if (action && !action.error) {
      fetchEntities(id);
    }
  };

  handleCreateLimit = async (params) => {
    const { setLimit, fetchEntities, params: { id } } = this.props;
    const { type, period, amount } = params;

    const duration = period.split(' ');
    const data = {
      duration: duration.shift(),
      durationUnit: duration.shift(),
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

  handleNoteClick = (target, data) => {
    if (data.note) {
      this.context.onEditNoteClick(target, data.note, { placement: 'left' });
    } else {
      this.context.onAddNoteClick(data.uuid, targetTypes.LIMIT)(target, { placement: 'left' });
    }
  };

  render() {
    const { modal } = this.state;
    const { list, limitPeriods } = this.props;

    return (
      <div>
        <div className="row margin-bottom-20">
          <div className="col-sm-3 col-xs-6">
            <span className="font-size-20">Limits</span>
          </div>
          <div className="col-sm-9 col-xs-6 text-right">
            <button
              className="btn btn-sm btn-primary-outline"
              onClick={this.handleOpenCreateLimitModal}
            >
              + New limit
            </button>
          </div>
        </div>

        <CommonGridView
          dataSource={list}
          onOpenCancelLimitModal={this.handleOpenCancelLimitModal}
          onNoteClick={this.handleNoteClick}
        />
        {
          modal.name === CANCEL_LIMIT_MODAL &&
          <CancelLimitModal
            {...modal.params}
            onSubmit={this.handleCancelLimit}
            onClose={this.handleCloseModal}
            isOpen
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
      </div>
    );
  }
}

export default View;
