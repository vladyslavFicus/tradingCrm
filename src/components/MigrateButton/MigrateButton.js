import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import MigrateToFsaModal from 'modals/MigrateToFsaModal';
import './MigrateButton.scss';

class MigrateButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    modals: PropTypes.shape({
      migrateToFsaModal: PropTypes.modalType,
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
      modals: { migrateToFsaModal },
      submitCallback,
      variables,
    } = this.props;

    migrateToFsaModal.show({
      submitCallback,
      variables,
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

export default withModals({
  migrateToFsaModal: MigrateToFsaModal,
})(MigrateButton);
