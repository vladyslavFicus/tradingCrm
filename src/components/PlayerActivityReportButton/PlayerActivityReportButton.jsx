import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { Button } from '@newage/backoffice_ui';
import PropTypes from '../../constants/propTypes';
import { services } from '../../constants/services';
import permissions from '../../config/permissions';
import Permissions from '../../utils/permissions';
import downloadFile from '../../utils/downloadFile';

const playerActivityReportPermission = new Permissions([permissions.PLAYER_REPORT.ACTIVITY]);

class PlayerActivityReportButton extends PureComponent {
  static propTypes = {
    playerUUID: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    modals: PropTypes.shape({
      playerActivityReportModal: PropTypes.modalType.isRequired,
    }).isRequired,
    checkService: PropTypes.func.isRequired,
    buttonProps: PropTypes.object,
  };
  static defaultProps = {
    buttonProps: {},
  };
  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  handleSubmit = async ({ date }) => {
    const {
      playerUUID,
      fullName,
      modals: { playerActivityReportModal },
      token,
      notify,
    } = this.props;

    const { success, error } = await downloadFile({
      contentType: 'text/csv',
      urlPath: `player_report/${playerUUID}/activity?date=${date}`,
      fileName: `activity-report-${fullName}-${date}`,
      token,
    });

    if (!success) {
      notify({
        level: 'error',
        title: I18n.t('component.PlayerActivityReportButton.failNotification'),
        message: error,
      });
    }

    playerActivityReportModal.hide();
  };

  handleClickActivityReport = () => {
    const {
      modals: { playerActivityReportModal },
      playerUUID,
      fullName,
    } = this.props;

    playerActivityReportModal.show({
      onSubmit: this.handleSubmit,
      playerUUID,
      fullName,
    });
  };

  render() {
    const { buttonProps, checkService } = this.props;
    const { permissions: currentPermissions } = this.context;

    if (!checkService(services.player_report) || !playerActivityReportPermission.check(currentPermissions)) {
      return null;
    }

    return (
      <Button
        {...buttonProps}
        onClick={this.handleClickActivityReport}
      >
        {I18n.t('component.PlayerActivityReportButton.title')}
      </Button>
    );
  }
}

export default PlayerActivityReportButton;
