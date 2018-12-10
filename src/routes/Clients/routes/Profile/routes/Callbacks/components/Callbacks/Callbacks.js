import React, { Fragment, PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import CallbacksList, { CallbacksGridFilter } from '../../../../../../../../components/CallbacksList';
import TabHeader from '../../../../../../../../components/TabHeader';
import { filterLabels } from '../../../../../../../../constants/callbacks';

class Callbacks extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const { match: { params: { id: userId } } } = this.props;

    return (
      <Fragment>
        <TabHeader title={I18n.t('CLIENT_PROFILE.TABS.CALLBACKS')} />
        <CallbacksGridFilter searchKeywordPlaceholder={I18n.t(filterLabels.callbackOrOperator)} />
        <div className="tab-wrapper">
          <CallbacksList userId={userId} />
        </div>
      </Fragment>
    );
  }
}

export default Callbacks;
