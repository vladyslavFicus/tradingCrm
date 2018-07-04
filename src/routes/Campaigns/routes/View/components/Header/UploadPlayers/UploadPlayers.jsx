import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../constants/propTypes';
import { withModals, withNotifications } from '../../../../../../../components/HighOrder';
import UploadPlayersModal from './UploadPlayersModal';
import { actionCreators } from '../../../modules';
import {
  types as uploadTypes,
  typesLabels,
  attributeLabels,
} from './constants';

class UploadPlayers extends Component {
  static propTypes = {
    types: PropTypes.arrayOf(PropTypes.string),
    modals: PropTypes.shape({
      uploadPlayerModal: PropTypes.modalType,
    }).isRequired,
  };
  static defaultProps = {
    types: [],
  };

  handleSubmit = async ({ type, file }) => {
    const {
      uploadPlayersFile,
      uploadResetPlayersFile,
      campaignUuid,
      modals: { uploadPlayerModal },
      notify,
    } = this.props;

    let response = {};

    switch (type) {
      case uploadTypes.UPLOAD_PLAYERS:
        response = await uploadPlayersFile(campaignUuid, file);
        break;
      case uploadTypes.RESET_PLAYERS:
        response = await uploadResetPlayersFile(campaignUuid, file);
        break;
      default:
        return null;
    }

    if (response) {
      notify({
        title: I18n.t(typesLabels[type]),
        level: response.error ? 'error' : 'success',
        message: `${I18n.t('COMMON.ACTIONS.UPLOADED')} ${response.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') :
          I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    }

    uploadPlayerModal.hide();
  };

  handleClickUpload = () => {
    const {
      modals: { uploadPlayerModal },
      types,
    } = this.props;

    uploadPlayerModal.show({
      onSubmit: this.handleSubmit,
      types,
    });
  };

  render() {
    const { types } = this.props;

    if (!types.length) {
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

const mapActions = {
  uploadPlayersFile: actionCreators.uploadPlayersFile,
  uploadResetPlayersFile: actionCreators.uploadResetPlayersFile,
};

export default compose(
  connect(null, mapActions),
  withModals({ uploadPlayerModal: UploadPlayersModal }),
  withNotifications,
)(UploadPlayers);
