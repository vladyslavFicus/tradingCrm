import React, { Component } from 'react';
import PreviewGrid from './PreviewGrid';
import Form from './Form';
import PermissionContent from '../../../../../components/PermissionContent';
import permissions from '../../../../../config/permissions';

class View extends Component {
  handleSubmit = data => this.handleFiltersChanged(data);

  handlePageChanged = (page, filters) => {
    if (!this.props.isLoading) {
      this.props.onFetch({ ...filters, page: page - 1 });
    }
  };

  handleFiltersChanged = (filters) => {
    this.props.onFetch({ ...filters, page: 0 });
  };

  render() {
    const {
      form,
      entities,
      filters,
      onDownload,
      currency,
    } = this.props;

    return (
      <div className="card">
        <div className="card-heading font-size-20">
          Revenue report
        </div>

        <PermissionContent permissions={permissions.REPORTS.PLAYER_LIABILITY_VIEW}>
          <div className="card-body">
            <Form
              fields={form.values}
              errors={form.errors}
              onDownload={onDownload}
              onSubmit={this.handleSubmit}
            />

            {
              Object.keys(filters).length > 0 &&
              <PreviewGrid
                onFiltersChanged={this.handleFiltersChanged}
                onPageChanged={this.handlePageChanged}
                reportType={filters.type}
                filters={filters}
                {...entities}
                currency={currency}
              />
            }
          </div>
        </PermissionContent>
      </div>
    );
  }
}

export default View;
