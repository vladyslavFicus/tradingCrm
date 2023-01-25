import React, { PureComponent } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { withRequests } from 'apollo';
import NotFound from 'routes/NotFound';
import PropTypes from 'constants/propTypes';
import Route from 'components/Route';
import Tabs from 'components/Tabs';
import BranchHeader from 'components/BranchHeader';
import HierarchyProfileRules from 'components/HierarchyProfileRules';
import BranchInfoQuery from './graphql/BranchInfoQuery';
import './OfficeProfile.scss';

class OfficeProfile extends PureComponent {
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
      <div className="OfficeProfile">
        <div className="OfficeProfile__header">
          <BranchHeader
            branchData={branchInfo}
            branchId={params.id}
            loading={loading}
          />
        </div>
        <Tabs
          items={[{
            label: 'HIERARCHY.PROFILE_RULE_TAB.NAME',
            url: '/offices/:id/rules',
          }]}
          location={location}
          params={params}
        />
        <div className="OfficeProfile__body">
          <Switch>
            <Route
              path={`${path}/rules`}
              component={() => <HierarchyProfileRules title="OFFICES.TABS.RULES.TITLE" params={params} />}
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
})(OfficeProfile);
