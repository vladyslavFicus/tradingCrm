import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionCreators as usersListActionCreators } from '../modules/users-list';
import Table from './Table';
import { Pagination } from 'react-bootstrap';

class List extends Component {
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillMount() {
    this.props.loadItems(0);
  }

  handleSelect(eventKey) {
    this.props.loadItems(eventKey - 1);
  }

  render() {
    const { users } = this.props;

    return <div className="page-content-inner">
      <section className="panel panel-with-borders">
        <div className="panel-heading">
          <h3>Users</h3>
        </div>

        <div className="panel-body">
          <div className="row">
            <div className="col-lg-12">
              <Table isLoading={users.isLoading} items={users.content}/>
            </div>
          </div>

          <div className="row">
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
                activePage={users.currentPage + 1}
                onSelect={this.handleSelect}/>
            </div>
          </div>
        </div>
      </section>
    </div>;
  }
}

const mapStateToProps = (state) => ({ ...state.usersList });
const mapActions = {
  ...usersListActionCreators,
};

export default connect(mapStateToProps, mapActions)(List);
