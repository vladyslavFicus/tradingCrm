import React, { Component } from 'react';
import { withRouter } from 'react-router';

class Logout extends Component {
  componentDidMount() {
    this.props.logout();
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.uuid && !nextProps.token) {
      this.props.router.replace('/');
    }
  }

  render() {
    return <p>You have been logged out, you will be redirected shortly to login...</p>;
  }
}

Logout.propTypes = {
  router: React.PropTypes.object.isRequired,
};

export default withRouter(Logout);
