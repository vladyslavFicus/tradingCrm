import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import history from 'router/history';
import PropTypes from '../../../../../../../constants/propTypes';
import { actions } from '../../../../../../../constants/files';
import { getApiRoot } from '../../../../../../../config';
import { targetTypes as fileTargetTypes } from '../../../../../../../components/Files/constants';
import FilesFilterForm from './FilesFilterForm';
import CommonFileGridView from '../../../components/CommonFileGridView';
import TabHeader from '../../../../../../../components/TabHeader';

class Files extends Component {
  static contextTypes = {
    showImages: PropTypes.func.isRequired,
    onUploadFileClick: PropTypes.func.isRequired,
    setFileChangedCallback: PropTypes.func.isRequired,
  };

  static propTypes = {
    files: PropTypes.shape({
      data: PropTypes.pageable(PropTypes.fileEntity),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    downloadFile: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    refuse: PropTypes.func.isRequired,
    verify: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.context.setFileChangedCallback(this.props.files.refetch);
  }

  componentWillUnmount() {
    this.context.setFileChangedCallback(null);
  }

  handlePageChanged = () => {
    const {
      files: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } });

  handleStatusActionClick = (uuid, action) => {
    const variables = { uuid };

    switch (action) {
      case actions.VERIFY:
        this.props.verify({ variables });
        break;
      case actions.REFUSE:
        this.props.refuse({ variables });
        break;
      default:
        break;
    }
  };

  handleDownloadFileClick = (data) => {
    this.props.downloadFile(data);
  };

  handleDeleteFileClick = async ({ uuid }) => {
    const { data: { file: { delete: { error } } } } = await this.props.delete({ variables: { uuid } });

    if (!error) {
      this.props.files.refetch();
    }
  };

  handlePreviewImageClick = (data) => {
    this.context.showImages(`${getApiRoot()}/profile/files/download/${data.uuid}`, data.type);
  };

  render() {
    const {
      files,
      files: { loading },
    } = this.props;

    const entities = get(files, 'files', { content: [], totalPages: 0, number: 0 });

    return (
      <Fragment>
        <TabHeader title="Files">
          <button
            type="button"
            className="btn btn-sm btn-primary-outline"
            onClick={() => this.context.onUploadFileClick({
              targetType: fileTargetTypes.FILES,
            })}
          >
            + Upload file
          </button>
        </TabHeader>
        <FilesFilterForm
          onSubmit={this.handleFiltersChanged}
        />
        <div className="tab-wrapper">
          <CommonFileGridView
            dataSource={entities.content}
            totalPages={entities.totalPages}
            activePage={entities.number + 1}
            loading={loading && entities.content.length === 0}
            lazyLoad
            onPageChange={this.handlePageChanged}
            onStatusActionClick={this.handleStatusActionClick}
            onDownloadFileClick={this.handleDownloadFileClick}
            onDeleteFileClick={this.handleDeleteFileClick}
            onPreviewImageClick={this.handlePreviewImageClick}
            showNoResults={entities.content.length === 0}
          />
        </div>
      </Fragment>
    );
  }
}

export default Files;
