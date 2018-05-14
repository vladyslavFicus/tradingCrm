import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import Card, { Title, Content } from '../../../../../components/Card';
import Amount from '../../../../../components/Amount';

class Report extends Component {
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

  handleExportClick = () => {
    this.props.onDownload();
  };

  renderAmountColumn = (data, column) => {
    const { currency } = this.props;
    return <Amount amount={data[column.name]} currency={currency} />;
  };

  render() {
    const { entities } = this.props;

    return (
      <Card>
        <Title>
          <span className="font-size-20">
            {I18n.t('COMMON.PLAYER_LIABILITY_REPORT')}
          </span>

          <button className="btn btn-primary ml-auto" onClick={this.handleExportClick}>
            {I18n.t('COMMON.BUTTONS.EXPORT_AS_CSV')}
          </button>
        </Title>

        <Content>
          <GridView
            dataSource={entities.content}
            onFiltersChanged={this.handleFiltersChanged}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
          >
            <GridViewColumn
              name="id"
              header="ID"
              headerStyle={{ width: '10%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridViewColumn
              name="playerUUID"
              header="Player"
              headerStyle={{ width: '20%' }}
            />
            <GridViewColumn
              name="country"
              header="Country"
              headerStyle={{ width: '10%' }}
            />
            <GridViewColumn
              name="balance"
              header="Balance"
              headerStyle={{ width: '15%' }}
              render={this.renderAmountColumn}
            />
            <GridViewColumn
              name="realMoneyBalance"
              header="Real money balance"
              headerStyle={{ width: '15%' }}
              render={this.renderAmountColumn}
            />
            <GridViewColumn
              name="bonusBalance"
              header="Bonus balance"
              headerStyle={{ width: '15%' }}
              render={this.renderAmountColumn}
            />
          </GridView>
        </Content>
      </Card>
    );
  }
}

Report.propTypes = {
  entities: PropTypes.object.isRequired,
  onDownload: PropTypes.func.isRequired,
  onFetch: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default Report;
