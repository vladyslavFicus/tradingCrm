import React, { PureComponent } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { withRequests } from 'apollo';
import NotFound from 'routes/NotFound';
import PropTypes from 'constants/propTypes';
import { branchTypes } from 'constants/hierarchyTypes';
import Route from 'components/Route';
import Tabs from 'components/Tabs';
import BranchHeader from 'components/BranchHeader';
import HierarchyProfileRules from 'components/HierarchyProfileRules';
import BranchInfoQuery from './graphql/BranchInfoQuery';
import './DeskProfile.scss';

class DeskProfile extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    branchInfoQuery: PropTypes.query({
      branchInfo: PropTypes.hierarchyBranch,
    }).isRequired,
  };

  render() {
    const {
      location,
      match: {
        params,
        path,
        url,
      },
      branchInfoQuery: {
        data,
        loading,
      },
    } = this.props;

    const branchInfo = data?.branchInfo || {};

    if (!loading && !data) {
      return <NotFound />;
    }

    return (
      <div className="DeskProfile">
        <div className="DeskProfile__header">
          <BranchHeader
            branchData={branchInfo}
            branchId={params.id}
            loading={loading}
          />
        </div>
        <Tabs
          items={[{
            label: 'HIERARCHY.PROFILE_RULE_TAB.NAME',
            url: '/desks/:id/rules',
          }]}
          location={location}
          params={params}
        />
        <div className="DeskProfile__body">
          <Switch>
            <Route
              path={`${path}/rules`}
              component={() => (
                <HierarchyProfileRules
                  title="DESKS.TABS.RULES.TITLE"
                  branchTypes={branchTypes.DESK}
                  params={params}
                />
              )}
            />
            <Redirect to={`${url}/rules`} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRequests({
  branchInfoQuery: BranchInfoQuery,
})(DeskProfile);
