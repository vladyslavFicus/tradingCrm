import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ApolloProvider from '../graphql/ApolloProvider';
import IndexRoute from '../routes/IndexRoute';
import history from '../router/history';

class AppContainer extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  };

  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <ApolloProvider>
          <Router history={history}>
            <IndexRoute />
          </Router>
        </ApolloProvider>
      </Provider>
    );
  }
}

export default AppContainer;
