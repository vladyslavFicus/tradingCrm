import React, { Component } from 'react';

export default PagenableFilterable => class PagenableFilterableComponent extends Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
  }

  componentWillMount() {
    this.handleFiltersChanged();
  }

  handlePageChanged(page, filters = {}) {
    if (!this.props.list.isLoading) {
      this.props.fetchEntities({ ...filters, page: page - 1 });
    }
  }

  handleFiltersChanged(filters = {}) {
    this.props.fetchEntities({ ...filters, page: 0 });
  }

  render() {
    return (
      <PagenableFilterable
        {...this.props}
        handlePageChanged={this.handlePageChanged}
        handleFiltersChanged={this.handleFiltersChanged}
      />
    );
  }
};
