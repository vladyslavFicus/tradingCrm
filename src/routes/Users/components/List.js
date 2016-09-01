import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionCreators as usersListActionCreators } from '../modules/users-list';
import Table from './Table';
import { Pagination } from 'react-bootstrap';

class List extends Component {
  constructor(props) {
    super(props);

    this.handleSelectPage = this.handleSelectPage.bind(this);
    this.handleFilterChanged = this.handleFilterChanged.bind(this);

    this.state = {
      filters: {
        username: '',
        email: '',
        currency: '',
        uuid: '',
      },
    };
  }

  componentWillMount() {
    this.onFiltersChanged();
  }

  handleSelectPage(eventKey) {
    this.props.loadItems(eventKey - 1, this.state.filters);
  }

  handleFilterChanged(name, value) {
    if (value === null || value !== '' && value.length < 3) {
      return false;
    }

    if (name in this.state.filters) {
      this.setState({
        filters: {
          ...this.state.filters,
          [name]: value,
        },
      }, this.onFiltersChanged);
    }
  }

  onFiltersChanged() {
    this.props.loadItems(0, this.state.filters);
  }

  render() {
    const { users: data } = this.props;
    const { users, isLoading } = data;

    return <div className="page-content-inner">
      <section className="panel panel-with-borders">
        <div className="panel-heading">
          <h3>Users</h3>
        </div>

        <div className="panel-body">
          <div className="row">
            <div className="col-lg-12">
              <Table
                handleFilterChange={this.handleFilterChanged}
                items={users.content}
              />
            </div>
          </div>

          {users.totalPages > 1 && <div className="row">
            <div className="col-lg-12">
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                items={users.totalPages}
                maxButtons={5}
                activePage={users.number + 1}
                onSelect={this.handleSelectPage}/>
            </div>
          </div>}
        </div>
      </section>
    </div>;
  }
}

const mapStateToProps = (state) => ({ users: { ...state.usersList } });
const mapActions = {
  ...usersListActionCreators,
};

export default connect(mapStateToProps, mapActions)(List);
