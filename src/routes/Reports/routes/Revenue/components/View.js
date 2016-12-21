import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import Panel, { Title, Content } from 'components/Panel';
import Form from './Form';

class View extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePageChanged(page, filters) {
    if (!this.props.isLoading) {
      this.props.onFetch({ ...filters, page: page - 1 });
    }
  }

  handleFiltersChanged(filters) {
    this.props.onFetch({ ...filters, page: 0 });
  }

  handleExportClick(e) {
    this.props.onDownload(this.props.filters);
  }

  handleSubmit(data) {
    return this.handleFiltersChanged(data);
  }

  render() {
    const { errors, values, entities, filters } = this.props;

    return <div className="page-content-inner">
      <Panel withBorders>
        <Title>
          <h3>Revenue report</h3>
        </Title>

        <Content>
          <Form
            fields={values}
            errors={errors}
            onSubmit={this.handleSubmit}
          />

          {Object.keys(filters).length > 0 && <GridView
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
            <GridColumn
              name="playerUUID"
              header="Player"
              headerStyle={{ width: '20%' }}
            />
            <GridColumn
              name="country"
              header="Country"
              headerStyle={{ width: '10%' }}
            />
            <GridColumn
              name="eu"
              header="EU"
              headerStyle={{ width: '5%' }}
              render={this.renderEuColumn}
            />
            <GridColumn
              name="balance"
              header="Balance"
              headerStyle={{ width: '15%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridColumn
              name="realMoneyBalance"
              header="Real money balance"
              headerStyle={{ width: '15%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridColumn
              name="bonusBalance"
              header="Bonus balance"
              headerStyle={{ width: '15%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridColumn
              name="pendingBets"
              header="Pending bets"
              headerStyle={{ width: '10%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
          </GridView>}
        </Content>
      </Panel>
    </div>;
  }
}

View.propTypes = {};

export default View;
