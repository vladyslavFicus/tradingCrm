import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import GridView, { GridColumn } from 'components/GridView';
import { Link } from 'react-router';
import { DropDownFilter } from 'components/Forms/Filters';
import moment from 'moment';

class List extends Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
    this.handleChangeCampaignState = this.handleChangeCampaignState.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  handlePageChanged(page, filters) {
    if (!this.props.list.isLoading) {
      this.props.fetchEntities({ ...filters, page: page - 1 });
    }
  }

  handleFiltersChanged(filters) {
    this.props.fetchEntities({ ...filters, page: 0 });
  }

  componentWillMount() {
    this.handleFiltersChanged({});
  }

  handleChangeCampaignState(filters, state, id) {
    this.props.changeCampaignState(state, id)
      .then(() => this.props.fetchEntities(filters));
  }

  renderActions(data, column, filters) {
    return <div className="btn-group btn-group-sm">
      {data.state === 'INACTIVE' && <Link
        to={`/bonus-campaigns/update/${data.id}`}
        className="btn btn-sm btn-primary btn-secondary"
        title="Edit campaign"
      >
        <i className="fa fa-pencil"/>
      </Link>}
      {data.state === 'INACTIVE' && <a
        className="btn btn-sm btn-success btn-secondary"
        onClick={() => this.handleChangeCampaignState(filters, 'activate', data.id)}
        title="Activate campaign"
      >
        <i className="fa fa-check"/>
      </a>}
      {data.state !== 'COMPLETED' && <a
        className="btn btn-sm btn-danger btn-secondary"
        onClick={() => this.handleChangeCampaignState(filters, 'complete', data.id)}
        title="Complete campaign"
      >
        <i className="fa fa-times"/>
      </a>}
    </div>;
  }

  render() {
    const { list: { entities } } = this.props;

    return <div className="page-content-inner">
      <Panel withBorders>
        <Title>
          <h3>Bonus campaigns</h3>
        </Title>

        <Content>
          <div className="row margin-bottom-15">
            <div className="col-lg-12">
              <div className="text-right">
                <Link to={'/bonus-campaigns/create'} className="btn btn-primary">
                  Create campaign
                </Link>
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
              name="campaignPriority"
              header="Priority"
              headerStyle={{ width: '10%' }}
            />
            <GridColumn
              name="campaignName"
              header="Name"
              headerStyle={{ width: '15%' }}
            />
            <GridColumn
              name="bonusLifetime"
              header="Bonus lifetime"
              headerStyle={{ width: '10%' }}
            />
            <GridColumn
              name="eventsType"
              header="Events type"
              headerStyle={{ width: '15%' }}
              render={(data, column) => data[column.name].join()}
            />
            <GridColumn
              name="id"
              header="Period"
              headerStyle={{ width: '20%' }}
              render={(data, column) => <small>
                {moment(data.startDate).format('YYYY-MM-DD HH:mm:ss')} &mdash;
                {moment(data.endDate).format('YYYY-MM-DD HH:mm:ss')}
              </small>}
            />
            <GridColumn
              name="state"
              header="Status"
              headerStyle={{ width: '10%' }}
              filter={(onFilterChange) => <DropDownFilter
                name="state"
                items={{
                  '': 'All',
                  INACTIVE: 'Inactive',
                  IN_PROGRESS: 'In progress',
                  ACTIVE: 'Active',
                  COMPLETED: 'Completed',
                }}
                onFilterChange={onFilterChange}
              />}
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
