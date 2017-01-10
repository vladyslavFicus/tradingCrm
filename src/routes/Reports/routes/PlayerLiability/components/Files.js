import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import Panel, { Title, Content } from 'components/Panel';

class Files extends Component {
  handlePageChanged = (page, filters) => {
    if (!this.props.isLoading) {
      this.props.onFetch({ ...filters, page: page - 1 });
    }
  };

  handleFiltersChanged = (filters) => {
    this.props.onFetch({ ...filters, page: 0 });
  };

  handleExportClick = (e) => {
    this.props.onDownload();
  };

  componentDidMount() {
    this.handleFiltersChanged({});
  }

  render() {
    const { entities } = this.props;

    return <Panel withBorders>
      <Title>
        <h3>Report files</h3>
      </Title>

      <Content>
        <GridView
          dataSource={entities.content}
          onFiltersChanged={this.handleFiltersChanged}
          onPageChange={this.handlePageChanged}
          activePage={entities.number + 1}
          totalPages={entities.totalPages}
        >
          <GridColumn
            name="id"
            header="ID"
            headerStyle={{ width: '10%' }}
            render={(data, column) => <small>{data[column.name]}</small>}
          />
        </GridView>
      </Content>
    </Panel>;
  }
}

Files.propTypes = {
  entities: PropTypes.object.isRequired,
  onDownload: PropTypes.func.isRequired,
  onFetch: PropTypes.func.isRequired,
};

export default Files;
