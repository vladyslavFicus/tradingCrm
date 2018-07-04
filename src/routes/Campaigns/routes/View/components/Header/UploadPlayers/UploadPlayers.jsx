import React, { Component } from 'react';
import { compose } from 'redux';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../constants/propTypes';
import { withModals } from '../../../../../../../components/HighOrder';
import UploadPlayersModal from './UploadPlayersModalContainer';
import { attributeLabels } from './constants';

class UploadPlayers extends Component {
  static propTypes = {
    types: PropTypes.arrayOf(PropTypes.string),
    campaignUuid: PropTypes.string.isRequired,
    modals: PropTypes.shape({
      uploadPlayerModal: PropTypes.modalType,
    }).isRequired,
  };
  static defaultProps = {
    types: [],
  };

  handleClickUpload = () => {
    const {
      modals: { uploadPlayerModal },
      types,
      campaignUuid,
    } = this.props;

    uploadPlayerModal.show({
      types,
      campaignUuid,
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

export default compose(
  withModals({ uploadPlayerModal: UploadPlayersModal }),
)(UploadPlayers);
