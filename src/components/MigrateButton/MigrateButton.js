import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { get, omit } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { withNotifications, withModals } from 'components/HighOrder';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import clientsBulkMigrationMutation from './graphql/clientsBulkMigrateMutation';
import './MigrateButton.scss';

class MigrateButton extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    className: PropTypes.string,
    migrateClientsMutation: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
    }).isRequired,
    variables: PropTypes.shape({
      clients: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
      })),
      totalElements: PropTypes.number,
      allRowsSelected: PropTypes.bool,
    }).isRequired,
    submitCallback: PropTypes.func,
  };

  static defaultProps = {
    className: 'MigrateButton',
    submitCallback: () => {},
  };

  handleTriggerConfirmationModalToMigrate = () => {
    const {
      modals: { confirmationModal },
    } = this.props;

    confirmationModal.show({
      onSubmit: this.handleSubmitConfirmationModal,
      modalTitle: I18n.t('MIGRATE.MODAL.TITLE'),
      actionText: I18n.t('MIGRATE.MODAL.TEXT'),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  }

  handleSubmitConfirmationModal = async () => {
    await this.bulkMigrate();
    this.props.submitCallback();
  }

  bulkMigrate = async () => {
    const {
      notify,
      variables,
      variables: { allRowsSelected },
      migrateClientsMutation,
      location: { query },
      modals: { confirmationModal },
    } = this.props;

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

    confirmationModal.hide();

    notify({
      level: success ? 'success' : 'error',
      title: success
        ? I18n.t('COMMON.SUCCESS')
        : I18n.t('COMMON.FAIL'),
      message: success
        ? I18n.t('MIGRATE.NOTIFICATION.SUCCESS_TEXT')
        : I18n.t('MIGRATE.NOTIFICATION.ERROR_TEXT'),
    });
  }

  render() {
    const { className } = this.props;

    return (
      <button
        className={className}
        onClick={this.handleTriggerConfirmationModalToMigrate}
        type="button"
      >
        {I18n.t('MIGRATE.BUTTON')}
      </button>
    );
  }
}

export default compose(
  withRouter,
  withNotifications,
  withModals({ confirmationModal: ConfirmActionModal }),
  withRequests({
    migrateClientsMutation: clientsBulkMigrationMutation,
  }),
)(MigrateButton);
