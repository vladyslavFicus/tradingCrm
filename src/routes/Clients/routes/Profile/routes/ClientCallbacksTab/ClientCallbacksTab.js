import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import EventEmitter, { PROFILE_RELOAD } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/UI';
import ClientCallbacksGridFilter from './components/ClientCallbacksGridFilter';
import ClientCallbacksGrid from './components/ClientCallbacksGrid';
import CreateCallbackModal from './components/CreateCallbackModal';
import getClientCallbacksQuery from './graphql/getClientCallbacksQuery';

class ClientCallbacksTab extends PureComponent {
  static propTypes = {
    clientCallbacksData: PropTypes.query({
      callbacks: PropTypes.shape({
        data: PropTypes.shape({
          content: PropTypes.arrayOf(PropTypes.callback),
        }),
      }),
    }).isRequired,
    modals: PropTypes.shape({
      createCallbackModal: PropTypes.modalType,
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.onProfileEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.onProfileEvent);
  }

  onProfileEvent = () => {
    this.props.clientCallbacksData.refetch();
  };

  handleOpenAddCallbackModal = () => {
    const {
      clientCallbacksData: { refetch },
      modals: { createCallbackModal },
    } = this.props;

    createCallbackModal.show({
      onSuccess: refetch,
    });
  };

  render() {
    const { clientCallbacksData } = this.props;

    return (
      <>
        <TabHeader title={I18n.t('CLIENT_PROFILE.TABS.CALLBACKS')}>
          <Button
            small
            commonOutline
            onClick={this.handleOpenAddCallbackModal}
          >
            {I18n.t('CLIENT_PROFILE.CALLBACKS.ADD_CALLBACK')}
          </Button>
        </TabHeader>

        <ClientCallbacksGridFilter />
        <ClientCallbacksGrid clientCallbacksData={clientCallbacksData} />
      </>
    );
  }
}

export default compose(
  withModals({
    createCallbackModal: CreateCallbackModal,
  }),
  withRequests({
    clientCallbacksData: getClientCallbacksQuery,
  }),
)(ClientCallbacksTab);
