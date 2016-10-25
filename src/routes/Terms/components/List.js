import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import GridView, { GridColumn } from 'components/GridView';
import { Link } from 'react-router';
import { TextFilter, DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';
import moment from 'moment';

class List extends Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
  }

  handlePageChanged(page, filters = {}) {
    if (!this.props.list.isLoading) {
      this.props.fetchEntities({ ...filters, page: page - 1 });
    }
  }

  handleFiltersChanged(filters = {}) {
    this.props.fetchEntities({ ...filters, page: 0 });
  }

  componentWillMount() {
    this.handleFiltersChanged();
  }

  renderActions(data, column, filters) {
    return <div>
      <Link
        to={`/terms/view/${data.id}`}
        className="btn btn-sm btn-primary btn-secondary"
        title="View"
      >
        <i className="fa fa-search"/>
      </Link>
    </div>;
  }

  render() {
    const { list: { entities } } = this.props;

    return <div className="page-content-inner">
      <Panel withBorders>
        <Title>
          <h3>Terms & conditions</h3>
        </Title>

        <Content>
          <div className="row margin-bottom-15">
            <div className="col-lg-12">
              <div className="text-right">
                <Link to={'/terms/create'} className="btn btn-primary">Create</Link>
              </div>
            </div>
          </div>

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
            />
            <GridColumn
              name="publicationDate"
              header="Publication date"
              headerClassName="text-center"
              headerStyle={{ width: '15%' }}
              render={(data, column) => moment(data[column.name]).format('DD.MM.YYYY HH:mm:ss')}
              className="text-center"
            />
            <GridColumn
              name="content"
              header="Content"
              render={(data, column) => {
                let content = data[column.name].replace(/<[^>]*>/g, '');

                return content.length > 255 ? content.substr(0, 255) + '...' : content;
              }}

            />
            <GridColumn
              name="actions"
              header="Actions"
              headerStyle={{ width: '10%' }}
              render={this.renderActions}
            />
          </GridView>
        </Content>
      </Panel>
    </div>;
  }
}

export default List;
