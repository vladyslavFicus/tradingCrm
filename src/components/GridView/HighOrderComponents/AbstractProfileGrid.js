import React, { Component } from 'react';
import { Link } from 'react-router';

export default (CustomComponent) => class AbstractProfileGridComponent extends Component {

  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  handlePageChanged(page, filters = {}) {
    if (!this.props.list.isLoading) {
      this.props.fetchEntities({ ...filters, page: page - 1 });
    }
  }

  handleFiltersChanged(filters = {}) {
    this.props.fetchEntities({ ...filters, page: 0 });
  }

  componentWillMount() {
    this.handleFiltersChanged();
  }

  renderActions(data) {
    return <div>
      <Link to={`/users/${data.uuid}/profile`} title={'View user profile'}>
        <i className="fa fa-gear"/>
      </Link>
    </div>;
  }

  render() {
    return <CustomComponent
      {...this.props}
      handlePageChanged={ this.handlePageChanged }
      handleFiltersChanged={ this.handleFiltersChanged }
      renderActions={ this.renderActions }
    />;
  }
};
