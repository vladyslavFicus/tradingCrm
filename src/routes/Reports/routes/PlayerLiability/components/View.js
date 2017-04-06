import React, { Component, PropTypes } from 'react';
import PermissionContent from '../../../../../components/PermissionContent';
import Permissions from '../../../../../utils/permissions';
import permission from '../../../../../config/permissions';
import Report from './Report';
import Files from './Files';

const viewFilesPermissions = new Permissions(permission.REPORTS.PLAYER_LIABILITY_FILES_VIEW);
const viewReportPermissions = new Permissions(permission.REPORTS.PLAYER_LIABILITY_VIEW);

class View extends Component {
  render() {
    const {
      files,
      report,
      onFilesDownload,
      onFilesFetch,
      onReportDownload,
      onReportFetch,
      currency,
    } = this.props;

    return <div className="page-content-inner">
      <PermissionContent permissions={viewFilesPermissions}>
        <Files
          {...files}
          onDownload={onFilesDownload}
          onFetch={onFilesFetch}
        />
      </PermissionContent>

      <PermissionContent permissions={viewReportPermissions}>
        <Report
          {...report}
          onDownload={onReportDownload}
          onFetch={onReportFetch}
          currency={currency}
        />
      </PermissionContent>
    </div>;
  }
}

View.propTypes = {
  files: PropTypes.object.isRequired,
  onFilesFetch: PropTypes.func.isRequired,
  onFilesDownload: PropTypes.func.isRequired,
  report: PropTypes.object.isRequired,
  onReportFetch: PropTypes.func.isRequired,
  onReportDownload: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
};

export default View;
