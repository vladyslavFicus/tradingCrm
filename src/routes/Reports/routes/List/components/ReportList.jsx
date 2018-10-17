import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { Card, CardBody, CardHeading, GridViewColumn, GridView } from '@newage/backoffice_ui';
import PropTypes from 'prop-types';
import FilterForm from './FilterForm';
import history from '../../../../../router/history';
import ReportItem from './ReportItem';
import './ReportList.scss';
import getStartDateOfMonth from '../../../../../utils/getStartDateOfMonth';

class ReportList extends Component {
  static propTypes = {
    paymentReport: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loadMoreReports: PropTypes.func.isRequired,
      paymentReport: PropTypes.shape({
        data: PropTypes.shape({
          number: PropTypes.number,
          totalPages: PropTypes.number,
          last: PropTypes.bool,
          content: PropTypes.arrayOf(PropTypes.shape({
            date: PropTypes.string,
            profit: PropTypes.arrayOf(PropTypes.shape({
              amount: PropTypes.number,
              currency: PropTypes.string,
            })),
            withdrawals: PropTypes.arrayOf(PropTypes.shape({
              amount: PropTypes.number,
              currency: PropTypes.string,
            })),
            deposits: PropTypes.arrayOf(PropTypes.shape({
              amount: PropTypes.number,
              currency: PropTypes.string,
            })),
          })),
        }),
      }),
    }).isRequired,
    locale: PropTypes.string.isRequired,
  };

  handlePageChange = () => {
    const {
      paymentReport: { loading, loadMoreReports },
    } = this.props;

    if (!loading) {
      loadMoreReports();
    }
  };

  handleRefresh = (filters = null) => {
    history.replace({ query: { filters } });
  };

  renderReportItem = report => (
    <ReportItem
      key={report.date}
      date={report.date}
      deposits={report.deposits}
      withdrawals={report.withdrawals}
      profits={report.profit}
    />
  );

  render() {
    const { paymentReport: data, locale } = this.props;
    const paymentReport = get(data, 'paymentReport.data', { content: [] });

    return (
      <Card>
        <CardHeading>
          <div className="font-size-20" id="report-list">
            {I18n.t('route.reports.component.ReportList.title')}
          </div>
        </CardHeading>
        <FilterForm initialFilters={{ ...getStartDateOfMonth() }} onSubmit={this.handleRefresh} onReset={this.handleRefresh} />
        <CardBody>
          <div className="report-list">
            <GridView
              dataSource={paymentReport.content}
              onPageChange={this.handlePageChange}
              activePage={paymentReport.number + 1}
              locale={locale}
              totalPages={paymentReport.totalPages}
              lazyLoad
              last={paymentReport.last}
              showNoResults={paymentReport.content.length === 0}
            >
              <GridViewColumn
                render={this.renderReportItem}
              />
            </GridView>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default ReportList;
