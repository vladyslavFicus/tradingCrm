import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
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

    const totalElements = filesQuery.data?.files?.totalElements;

    return (
      <div className="Files">
        <div className="Files__header">
          <div className="Files__title">
            <strong>{totalElements} </strong>
            {I18n.t('COMMON.KYC_DOCUMENTS')}
          </div>
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
