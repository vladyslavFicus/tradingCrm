import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';

class View extends Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
  }

  handlePageChanged(page, filters) {
    if (!this.props.list.isLoading) {
      this.props.fetchEntities({ ...filters, page: page - 1 });
    }
  }

  handleFiltersChanged(filters) {
    this.props.onFetch({ ...filters, page: 0 });
  }

  componentWillMount() {
    this.handleFiltersChanged({});
  }

  render() {
    const { list: { entities } } = this.props;

    return <div className="page-content-inner">
      <Panel withBorders>
        <Title>
          <h3>Player liability report</h3>
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
              headerStyle={{ width: '20%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridColumn
              name="playerUUID"
              header="Player"
              headerStyle={{ width: '20%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridColumn
              name="country"
              header="Country"
              headerStyle={{ width: '20%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridColumn
              name="eu"
              header="EU"
              headerStyle={{ width: '20%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridColumn
              name="balance"
              header="Balance"
              headerStyle={{ width: '20%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridColumn
              name="realMoneyBalance"
              header="Real money balance"
              headerStyle={{ width: '20%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridColumn
              name="bonusBalance"
              header="Bonus balance"
              headerStyle={{ width: '20%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridColumn
              name="pendingBets"
              header="Pending bets"
              headerStyle={{ width: '20%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
          </GridView>
        </Content>
      </Panel>
    </div>;
  }
}

View.propTypes = {};

export default View;
