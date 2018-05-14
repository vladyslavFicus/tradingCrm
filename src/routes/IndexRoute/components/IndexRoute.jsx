import React, { Component, Fragment } from 'react';
import { Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { AppRoute, Route } from '../../../router';
import NotFoundContent from '../../../components/NotFoundContent';
import SignIn from '../../SignIn';

class IndexRoute extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      state: PropTypes.shape({
        modal: PropTypes.bool,
      }),
      query: PropTypes.object,
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { location } = this.props;
    const isNotFound = get(location, 'query.isNotFound');

    return (
      <Fragment>
        <Choose>
          <When condition={!isNotFound}>
            <Switch>
              <AppRoute
                path="/"
                exact
                component={SignIn}
              />
            </Switch>
          </When>
          <Otherwise>
            <Route component={NotFoundContent} />
          </Otherwise>
        </Choose>
      </Fragment>
    );
  }
}

export default withRouter(IndexRoute);
