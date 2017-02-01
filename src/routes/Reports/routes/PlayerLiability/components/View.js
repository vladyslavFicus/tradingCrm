import React, { Component, PropTypes } from 'react';
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
      <Files
        {...files}
        onDownload={onFilesDownload}
        onFetch={onFilesFetch}
      />
      <Report
        {...report}
        onDownload={onReportDownload}
        onFetch={onReportFetch}
        currency={currency}
      />
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
