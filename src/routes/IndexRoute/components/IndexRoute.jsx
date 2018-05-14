import React, { PureComponent } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { AppRoute, Route } from '../../../router';
import NotFound from '../../../routes/NotFound';
import CoreLayout from '../../../layouts/CoreLayout';
import BlackLayout from '../../../layouts/BlackLayout';
import SignIn from '../../SignIn';

class IndexRoute extends PureComponent {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      state: PropTypes.shape({
        modal: PropTypes.bool,
      }),
      query: PropTypes.object,
    }).isRequired,
    logged: PropTypes.bool.isRequired,
  };

  render() {
    const { location, logged } = this.props;
    const isNotFound = get(location, 'query.isNotFound');

    return (
      <CoreLayout>
        <Switch>
          <If condition={isNotFound}>
            <Route component={NotFound} />
          </If>
          <If condition={logged}>
            <Redirect from="/(sign-in|set-password|reset-password)" to="/" />
          </If>
          <AppRoute path="/users" layout={BlackLayout} component={() => <h1>TODO USERS ROUTE</h1>} auth />
          <AppRoute path="/sign-in" layout={BlackLayout} component={SignIn} />
          <Route component={NotFound} />
        </Switch>
      </CoreLayout>
    );
  }
}

export default IndexRoute;
