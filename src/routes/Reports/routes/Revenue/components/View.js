import React, { Component } from 'react';
import Panel, { Title, Content } from '../../../../../components/Panel';
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
      <div className="page-content-inner">
        <Panel withBorders>
          <Title>
            <span className="font-size-20">Revenue report</span>
          </Title>

          <PermissionContent permissions={permissions.REPORTS.PLAYER_LIABILITY_VIEW}>
            <Content>
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
            </Content>
          </PermissionContent>
        </Panel>
      </div>
    );
  }
}

export default View;
