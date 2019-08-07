import React, { Fragment, PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import CallbacksList, { CallbacksGridFilter } from '../../../../../../../../components/CallbacksList';
import TabHeader from '../../../../../../../../components/TabHeader';
import { filterLabels } from '../../../../../../../../constants/callbacks';

class Callbacks extends PureComponent {
  static propTypes = {
    callbacks: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      callbackAdd: PropTypes.modalType,
    }).isRequired,
  };

  handleOpenCallbackAddModal = () => {
    const {
      match: { params: { id: userId } },
      callbacks: { refetch },
    } = this.props;

    this.props.modals.callbackAdd.show({
      userId,
      onConfirm: refetch,
    });
  };

  render() {
    return (
      <Fragment>
        <TabHeader title={I18n.t('CLIENT_PROFILE.TABS.CALLBACKS')}>
          <button
            type="button"
            className="btn btn-sm btn-default-outline"
            onClick={this.handleOpenCallbackAddModal}
          >
            {I18n.t('CLIENT_PROFILE.CALLBACKS.ADD_CALLBACK')}
          </button>
        </TabHeader>
        <CallbacksGridFilter searchKeywordPlaceholder={I18n.t(filterLabels.callbackOrOperator)} />
        <div className="tab-wrapper">
          <CallbacksList withoutClientColumn callbacks={this.props.callbacks} />
        </div>
      </Fragment>
    );
  }
}

export default Callbacks;
