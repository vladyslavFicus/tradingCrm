import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import Panel, { Title, Content } from 'components/Panel';

class Report extends Component {
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

  renderEuColumn = (data, column) => <input
    type="checkbox"
    readOnly
    disabled
    defaultValue={data[column.name]}
  />;

  render() {
    const { entities } = this.props;

    return <Panel withBorders>
      <Title>
        <div className="pull-right">
          <button className="btn btn-primary" onClick={this.handleExportClick}>
            Export as CSV
          </button>
        </div>

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
        </GridView>
      </Content>
    </Panel>;
  }
}

Report.propTypes = {
  entities: PropTypes.object.isRequired,
  onDownload: PropTypes.func.isRequired,
  onFetch: PropTypes.func.isRequired,
};

export default Report;
