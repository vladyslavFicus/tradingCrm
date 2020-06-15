import React, { Component } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import FileGridView from './FileGridView';
import FilesFilterForm from './FilesFilterForm';

class Files extends Component {
  static propTypes = {
    ...PropTypes.router,
    fileList: PropTypes.shape({
      data: PropTypes.pageable(PropTypes.fileEntity),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    getFilesCategoriesList: PropTypes.shape({
      filesCategoriesList: PropTypes.shape({
        data: PropTypes.object,
      }),
    }).isRequired,
  };

  handleFiltersChanged = (filters = {}) => this.props.history.replace({ query: { filters } });

  handlePageChanged = () => {
    const {
      fileList: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  render() {
    const {
      fileList,
      fileList: { loading },
      getFilesCategoriesList,
    } = this.props;

    const entities = get(fileList, 'fileList.data') || { content: [] };
    const { __typename, ...categories } = get(getFilesCategoriesList, 'filesCategoriesList.data') || {};

    return (
      <div className="card">
        <div className="card-heading font-size-20">
          {I18n.t('COMMON.KYC_DOCUMENTS')}
        </div>
        <FilesFilterForm
          onSubmit={this.handleFiltersChanged}
          categories={categories}
        />
        <div className="tab-wrapper">
          <FileGridView
            data={entities.content}
            isLoading={loading && entities.content.length === 0}
            isLastPage={entities.last || false}
            handlePageChanged={this.handlePageChanged}
            withLazyLoad
            withNoResults={entities.content.length === 0}
          />
        </div>
      </div>
    );
  }
}

export default Files;
