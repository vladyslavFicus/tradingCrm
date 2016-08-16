import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionCreators as usersListActionCreators } from '../modules/users-list';
import Table from './Table';

class List extends Component {
  componentWillMount() {
    this.props.loadItems();
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
              <Table isLoading={users.isLoading} items={users.items}/>
            </div>
          </div>
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
