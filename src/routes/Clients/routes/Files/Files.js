import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import FilesGrid from './components/FilesGrid';
import FilesGridFilter from './components/FilesGridFilter';
import FilesQuery from './graphql/FilesQuery';
import './Files.scss';

class Files extends PureComponent {
  static propTypes = {
    filesQuery: PropTypes.query({
      files: PropTypes.pageable(PropTypes.fileEntity),
    }).isRequired,
  };

  render() {
    const { filesQuery } = this.props;

    return (
      <div className="Files">
        <div className="Files__header">
          <div className="Files__title">{I18n.t('COMMON.KYC_DOCUMENTS')}</div>
        </div>

        <FilesGridFilter handleRefetch={filesQuery.refetch} />
        <FilesGrid filesQuery={filesQuery} />
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    filesQuery: FilesQuery,
  }),
)(Files);
