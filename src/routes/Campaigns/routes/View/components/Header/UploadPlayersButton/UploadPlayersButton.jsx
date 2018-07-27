import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import PropTypes from '../../../../../../../constants/propTypes';
import { withModals } from '../../../../../../../components/HighOrder';
import UploadPlayersModal from './UploadPlayersModalContainer';
import { attributeLabels } from './constants';

class UploadPlayersButton extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.string),
    campaignUuid: PropTypes.string.isRequired,
    modals: PropTypes.shape({
      uploadPlayerModal: PropTypes.modalType,
    }).isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    actions: [],
    className: null,
  };

  handleClickUpload = () => {
    const {
      modals: { uploadPlayerModal },
      actions,
      campaignUuid,
    } = this.props;

    uploadPlayerModal.show({
      actions,
      campaignUuid,
    });
  };

  render() {
    const { actions, className } = this.props;

    if (!actions.length) {
      return null;
    }

    return (
      <button
        type="button"
        className={classNames('btn btn-default-outline btn-sm', className)}
        onClick={this.handleClickUpload}
      >
        {I18n.t(attributeLabels.uploadPlayers)}
      </button>
    );
  }
}

export default withModals({
  uploadPlayerModal: UploadPlayersModal,
})(UploadPlayersButton);
