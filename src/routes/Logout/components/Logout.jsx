import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withApollo } from 'react-apollo';

class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
  };

  state = {
    logged: true,
  };

  async componentWillMount() {
    await this.props.logout();
    await this.props.client.resetStore();
    this.setState({ logged: false });
  }

  render() {
    if (this.state.logged) {
      return null;
    }

    return <Redirect to="/sign-in" />;
  }
}

export default withApollo(Logout);
