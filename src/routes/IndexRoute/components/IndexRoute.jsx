import React, { PureComponent } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { AppRoute, Route } from '../../../router';
import NotFound from '../../../routes/NotFound';
import CoreLayout from '../../../layouts/CoreLayout';
import BlackLayout from '../../../layouts/BlackLayout';
import NewLayout from '../../../layouts/NewLayout';
import SignIn from '../../SignIn';
import Logout from '../../Logout';
import Players from '../../Players';
import SetPassword from '../../SetPassword';
import ResetPassword from '../../ResetPassword';

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
          <Choose>
            <When condition={logged}>
              <Redirect from="/(sign-in|set-password|reset-password)" to="/" />
              <Redirect exact from="/" to="/players" />
            </When>
            <Otherwise>
              <Redirect exact from="/" to="/sign-in" />
            </Otherwise>
          </Choose>
          <AppRoute path="/players" layout={NewLayout} component={Players} checkAuth />
          <Route path="/logout" component={Logout} checkAuth />
          <AppRoute path="/sign-in" layout={BlackLayout} component={SignIn} />
          <AppRoute path="/set-password" layout={BlackLayout} component={SetPassword} />
          <AppRoute path="/reset-password" layout={BlackLayout} component={ResetPassword} />
          <Route component={NotFound} />
        </Switch>
      </CoreLayout>
    );
  }
}

export default IndexRoute;
