import React, { Component } from 'react';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'constants/propTypes';
import history from 'router/history';
import Uuid from 'components/Uuid';
import FileGridView from './FileGridView';
import FilesFilterForm from './FilesFilterForm';

class Files extends Component {
  static propTypes = {
    fileList: PropTypes.shape({
      data: PropTypes.pageable(PropTypes.fileEntity),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } });

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

  renderFullName = ({ playerUUID, fullName }) => (
    <div>
      <div
        className="font-weight-700 cursor-pointer"
        onClick={() => window.open(`/clients/${playerUUID}/profile`, '_blank')}
      >
        {fullName}
      </div>
      <Uuid uuid={playerUUID} />
    </div>
  );

  render() {
    const {
      fileList,
      fileList: { loading },
    } = this.props;

    const entities = get(fileList, 'fileList', { content: [], totalPages: 0, number: 0 });

    return (
      <div className="card">
        <div className="card-heading font-size-20">
          {I18n.t('COMMON.KYC_DOCUMENTS')}
        </div>
        <FilesFilterForm
          onSubmit={this.handleFiltersChanged}
        />
        <div className="tab-wrapper">
          <FileGridView
            dataSource={entities.content}
            totalPages={entities.totalPages}
            activePage={entities.number + 1}
            last={entities.last}
            onPageChange={this.handlePageChanged}
            loading={loading && entities.content.length === 0}
            lazyLoad
            showNoResults={entities.content.length === 0}
            withActions={false}
            withNotes={false}
            renderFullName={this.renderFullName}
          />
        </div>
      </div>
    );
  }
}

export default Files;
