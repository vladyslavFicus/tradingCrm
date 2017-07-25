import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import { targetTypes } from '../../../../../../../../constants/note';
import ViewModalMain from '../ViewModalMain';
import ViewModalAdditional from '../ViewModalAdditional';
import ViewModalStatistics from '../ViewModalStatistics';
import NoteButton from '../../../../../../../../components/NoteButton';
import './ViewModal.scss';

class ViewModal extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.any.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string.isRequired,
    })).isRequired,
    item: PropTypes.freeSpinEntity.isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
  };
  static defaultProps = {
    isOpen: false,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.onEditNoteClick(target, note, { placement: 'top' });
    } else {
      this.context.onAddNoteClick(data.uuid, targetTypes.FREE_SPIN)(target, { placement: 'top' });
    }
  };

  renderNote = data => (
    <div className="row margin-top-20">
      <div className="col-md-12 text-center">
        <NoteButton
          id="free-spin-detail-modal-note"
          note={data.note}
          onClick={this.handleNoteClick}
          targetEntity={data}
          preview
        />
      </div>
    </div>
  );

  render() {
    const { item, actions, onClose, ...rest } = this.props;

    return (
      <Modal className="view-free-spin-modal" toggle={onClose} {...rest}>
        <ModalHeader toggle={onClose}>
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.TITLE')}
        </ModalHeader>
        <ModalBody>
          <ViewModalMain freeSpin={item} />
          <hr />
          <ViewModalAdditional freeSpin={item} />
          <ViewModalStatistics freeSpin={item} />
          {this.renderNote(item)}
        </ModalBody>
        <ModalFooter>
          {
            actions.length <= 2 &&
            <div className="row">
              {actions.map((action, index) => (
                <div key={action.children} className={classNames('col-md-6', { 'text-right': index !== 0 })}>
                  <button {...action} />
                </div>
              ))}
            </div>
          }
        </ModalFooter>
      </Modal>
    );
  }
}

export default ViewModal;
