import React, { Component } from 'react';
import CancelLimitModal from './CancelLimitModal';
import CommonGridView from './CommonGridView';
import { targetTypes } from '../../../../../constants/note';
import PropTypes from '../../../../../constants/propTypes';

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
    const action = await this.props.cancelLimit(this.props.params.id, type, limitId);
    this.handleCloseModal();

    if (action && !action.error) {
      this.props.fetchEntities(this.props.params.id);
    }
  };

  handleOpenCancelLimitModal = (e, name, params) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      modal: {
        name: 'cancel-limit',
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
    const { list } = this.props;

    return (
      <div>
        <CommonGridView
          dataSource={list}
          onOpenCancelLimitModal={this.handleOpenCancelLimitModal}
          onNoteClick={this.handleNoteClick}
        />
        {
          modal.name === 'cancel-limit' &&
          <CancelLimitModal
            {...modal.params}
            onSubmit={this.handleCancelLimit}
            onClose={this.handleCloseModal}
            isOpen
          />
        }
      </div>
    );
  }
}

export default View;
