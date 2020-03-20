import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { get, omit } from 'lodash';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import ShortLoader from 'components/ShortLoader';
import { Button } from 'components/UI';
import clientsBulkMigrationMutation from './graphql/clientsBulkMigrateMutation';
import './MigrateToFsaModal.scss';

class MigrateToFsaModal extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    migrateClientsMutation: PropTypes.func.isRequired,
    variables: PropTypes.shape({
      clients: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
      })),
      totalElements: PropTypes.number,
      allRowsSelected: PropTypes.bool,
    }).isRequired,
    submitCallback: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
  };

  state = {
    isLoading: false,
  };

  handleClose = () => {
    this.props.onCloseModal();
  };

  onHandleSubmit = async () => {
    const {
      notify,
      variables,
      variables: { allRowsSelected },
      migrateClientsMutation,
      location: { query },
      submitCallback,
      onCloseModal,
    } = this.props;

    this.setState({ isLoading: true });

    const response = await migrateClientsMutation({
      variables: {
        ...variables,
        ...(
          query
          && allRowsSelected
          && { searchParams: omit(query.filters, ['page.size']) }
        ),
      },
    });

    const success = get(response, 'data.clients.bulkMigrationUpdate.success') || false;

    notify({
      level: success ? 'success' : 'error',
      title: success
        ? I18n.t('COMMON.SUCCESS')
        : I18n.t('COMMON.FAIL'),
      message: success
        ? I18n.t('MIGRATE.NOTIFICATION.SUCCESS_TEXT')
        : I18n.t('MIGRATE.NOTIFICATION.ERROR_TEXT'),
    });

    if (success) {
      submitCallback();
      onCloseModal();
    } else {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { isOpen } = this.props;
    const { isLoading } = this.state;

    return (
      <Modal
        className="MigrateToFsaModal"
        toggle={this.handleClose}
        isOpen={isOpen}
      >
        <ModalHeader
          className="MigrateToFsaModal__header"
          toggle={this.handleClose}
        >
          {I18n.t('MIGRATE.MODAL.TITLE')}
        </ModalHeader>

        <Choose>
          <When condition={isLoading}>
            <ModalBody>
              <div className="MigrateToFsaModal__loader-container">
                <ShortLoader className="MigrateToFsaModal__loader" />
              </div>
            </ModalBody>
          </When>
          <Otherwise>
            <ModalBody>
              <div className="MigrateToFsaModal__message">
                {I18n.t('MIGRATE.MODAL.TEXT')}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={this.handleClose}
                commonOutline
              >
                {I18n.t('COMMON.CANCEL')}
              </Button>

              <Button
                onClick={this.onHandleSubmit}
                danger
                type="submit"
              >
                {I18n.t('COMMON.OK')}
              </Button>
            </ModalFooter>
          </Otherwise>
        </Choose>
      </Modal>
    );
  }
}

export default compose(
  withRouter,
  withNotifications,
  withRequests({
    migrateClientsMutation: clientsBulkMigrationMutation,
  }),
)(MigrateToFsaModal);
