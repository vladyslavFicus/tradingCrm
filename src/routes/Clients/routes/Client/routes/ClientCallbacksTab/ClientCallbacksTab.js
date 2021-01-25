import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import CreateCallbackModal from 'modals/CreateCallbackModal';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/UI';
import ClientCallbacksGridFilter from './components/ClientCallbacksGridFilter';
import ClientCallbacksGrid from './components/ClientCallbacksGrid';
import ClientCallbacksQuery from './graphql/ClientCallbacksQuery';
import './ClientCallbacksTab.scss';

class ClientCallbacksTab extends PureComponent {
  static propTypes = {
    clientCallbacksQuery: PropTypes.query({
      callbacks: PropTypes.pageable(PropTypes.callback),
    }).isRequired,
    modals: PropTypes.shape({
      createCallbackModal: PropTypes.modalType,
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(CLIENT_RELOAD, this.onProfileEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(CLIENT_RELOAD, this.onProfileEvent);
  }

  onProfileEvent = () => {
    this.props.clientCallbacksQuery.refetch();
  };

  handleOpenAddCallbackModal = () => {
    const {
      clientCallbacksQuery: { refetch },
      modals: { createCallbackModal },
    } = this.props;

    createCallbackModal.show({
      onSuccess: refetch,
    });
  };

  render() {
    const { clientCallbacksQuery } = this.props;

    return (
      <div className="ClientCallbacksTab">
        <TabHeader
          title={I18n.t('CLIENT_PROFILE.TABS.CALLBACKS')}
          className="ClientCallbacksTab__header"
        >
          <Button
            small
            commonOutline
            onClick={this.handleOpenAddCallbackModal}
          >
            {I18n.t('CLIENT_PROFILE.CALLBACKS.ADD_CALLBACK')}
          </Button>
        </TabHeader>

        <ClientCallbacksGridFilter handleRefetch={clientCallbacksQuery.refetch} />
        <ClientCallbacksGrid clientCallbacksQuery={clientCallbacksQuery} />
      </div>
    );
  }
}

export default compose(
  withModals({
    createCallbackModal: CreateCallbackModal,
  }),
  withRequests({
    clientCallbacksQuery: ClientCallbacksQuery,
  }),
)(ClientCallbacksTab);
