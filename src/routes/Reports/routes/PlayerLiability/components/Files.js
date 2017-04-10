import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from '../../../../../components/GridView';
import Panel, { Title, Content } from '../../../../../components/Panel';
import PermissionContent from '../../../../../components/PermissionContent';
import Permissions from '../../../../../utils/permissions';
import permission from '../../../../../config/permissions';

const viewFileRequiredPermissions = new Permissions([permission.REPORTS.PLAYER_LIABILITY_FILE_VIEW]);

class Files extends Component {
  static propTypes = {
    entities: PropTypes.object.isRequired,
    onDownload: PropTypes.func.isRequired,
    onFetch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
  };

  componentDidMount() {
    this.handleFiltersChanged({});
  }

  handlePageChanged = (page, filters) => {
    if (!this.props.isLoading) {
      this.props.onFetch({ ...filters, page: page - 1 });
    }
  };

  handleFiltersChanged = (filters) => {
    this.props.onFetch({ ...filters, page: 0 });
  };

  handleDownload = (id) => {
    this.props.onDownload(id);
  };

  renderActions = (data) => {
    return (
      <a
        onClick={() => this.handleDownload(data.fileName)}
      >
        <i className="fa fa-download" />
      </a>
    );
  };

  render() {
    const { entities } = this.props;

    return (
      <Panel withBorders>
        <Title>
          <h3>Report files</h3>
        </Title>

        <Content>
          <div className="row">
            <div className="col-sm-4">
              <GridView
                dataSource={entities.content}
                onFiltersChanged={this.handleFiltersChanged}
                onPageChange={this.handlePageChanged}
                activePage={entities.number + 1}
                totalPages={entities.totalPages}
              >
                <GridColumn
                  name="fileName"
                  header="Name"
                  headerStyle={{ width: '90%' }}
                />
                <PermissionContent permissions={viewFileRequiredPermissions}>
                  <GridColumn
                    name="actions"
                    header="Actions"
                    headerStyle={{ width: '10%' }}
                    headerClassName={'text-center'}
                    render={this.renderActions}
                    className={'text-center'}
                  />
                </PermissionContent>
              </GridView>
            </div>
          </div>
        </Content>
      </Panel>
    );
  }
}

export default Files;
