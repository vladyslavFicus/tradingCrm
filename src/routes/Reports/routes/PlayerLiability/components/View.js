import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PermissionContent from '../../../../../components/PermissionContent';
import permissions from '../../../../../config/permissions';
import Report from './Report';
import Files from './Files';

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
      <PermissionContent permissions={permissions.REPORTS.PLAYER_LIABILITY_FILES_VIEW}>
        <Files
          {...files}
          onDownload={onFilesDownload}
          onFetch={onFilesFetch}
        />
      </PermissionContent>

      <PermissionContent permissions={permissions.REPORTS.PLAYER_LIABILITY_VIEW}>
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
