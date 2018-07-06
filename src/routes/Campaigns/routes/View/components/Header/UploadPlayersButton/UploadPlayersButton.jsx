import React, { Component } from 'react';
import { compose } from 'redux';
import { I18n } from 'react-redux-i18n';
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
  };
  static defaultProps = {
    actions: [],
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
    const { actions } = this.props;

    if (!actions.length) {
      return null;
    }

    return (
      <button
        type="button"
        className="btn btn-sm btn-default-outline margin-right-10"
        onClick={this.handleClickUpload}
      >
        {I18n.t(attributeLabels.uploadPlayers)}
      </button>
    );
  }
}

export default compose(
  withModals({ uploadPlayerModal: UploadPlayersModal }),
)(UploadPlayersButton);
