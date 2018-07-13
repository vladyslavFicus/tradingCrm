import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import FilterForm from './FilterForm';
import GridView, { GridViewColumn } from '../../../../../../../../../components/GridView';
import { columns } from '../constants';

class TradingActivity extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    tradingActivity: PropTypes.shape({
      clientTradingActivity: PropTypes.object,
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
    }),
  };

  static defaultProps = {
    tradingActivity: {
      content: [],
    },
  };

  handlePageChanged = () => {
    // need data to make this working
  };

  handleApplyFilters = (variables) => {
    this.props.tradingActivity.refetch({ ...variables });
  };

  render() {
    const {
      tradingActivity: {
        clientTradingActivity,
        loading,
      },
      locale,
    } = this.props;

    return (
      <Fragment>
        <FilterForm
          onSubmit={this.handleApplyFilters}
        />
        <If condition={!loading}>
          <div className="tab-wrapper">
            <GridView
              dataSource={clientTradingActivity.content}
              onPageChange={this.handlePageChanged}
              activePage={clientTradingActivity.number + 1}
              totalPages={clientTradingActivity.totalPages}
              lazyLoad
              locale={locale}
              showNoResults={clientTradingActivity.totalElements === 0}
            >
              { columns(I18n).map(({ name, header, render }) => (
                <GridViewColumn
                  key={name}
                  name={name}
                  header={header}
                  render={render}
                />
              ))}
            </GridView>
          </div>
        </If>
      </Fragment>
    );
  }
}

export default TradingActivity;
