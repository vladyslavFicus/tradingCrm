import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import PreviewGrid from './PreviewGrid';
import Form from './Form';

class View extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
  }

  handleExportClick(e) {
    this.props.onDownload(this.props.filters);
  }

  handleSubmit(data) {
    return this.handleFiltersChanged(data);
  }

  handlePageChanged(page, filters) {
    if (!this.props.isLoading) {
      this.props.onFetch({ ...filters, page: page - 1 });
    }
  }

  handleFiltersChanged(filters) {
    this.props.onFetch({ ...filters, page: 0 });
  }

  render() {
    const {
      form,
      entities,
      filters,
      onDownload,
    } = this.props;

    return <div className="page-content-inner">
      <Panel withBorders>
        <Title>
          <h3>Revenue report</h3>
        </Title>

        <Content>
          <Form
            fields={form.values}
            errors={form.errors}
            onDownload={onDownload}
            onSubmit={this.handleSubmit}
          />

          {Object.keys(filters).length > 0 && <PreviewGrid
            onFiltersChanged={this.handleFiltersChanged}
            onPageChanged={this.handlePageChanged}
            reportType={filters.type}
            filters={filters}
            {...entities}
          />}
        </Content>
      </Panel>
    </div>;
  }
}

View.propTypes = {};

export default View;
