import React, { PureComponent } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { withRequests } from 'apollo';
import NotFound from 'routes/NotFound';
import PropTypes from 'constants/propTypes';
import { deskTypes } from 'constants/rules';
import { branchTypes } from 'constants/hierarchyTypes';
import Route from 'components/Route';
import Tabs from 'components/Tabs';
import BranchHeader from 'components/BranchHeader';
import HierarchyProfileRules from 'components/HierarchyProfileRules';
import BranchInfoQuery from './graphql/BranchInfoQuery';

const RulesRetention = HierarchyProfileRules('TEAMS.TABS.RULES.TITLE', deskTypes.RETENTION, branchTypes.TEAM);
const RulesSales = HierarchyProfileRules('TEAMS.TABS.RULES.TITLE', deskTypes.SALES, branchTypes.TEAM);

class TeamProfile extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      path: PropTypes.string.isRequired,
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
      },
      branchInfoQuery: {
        data,
        loading,
      },
    } = this.props;

    const branchInfo = data?.branchInfo;

    if (!branchInfo) {
      return <NotFound />;
    }

    return (
      <div className="profile">
        <div className="profile__info">
          <BranchHeader
            branchData={branchInfo}
            branchId={params.id}
            loading={loading}
          />
        </div>
        <Tabs
          items={[{
            label: 'HIERARCHY.PROFILE_RULE_TAB.NAME',
            url: '/teams/:id/rules',
          }]}
          location={location}
          params={params}
        />
        <div className="card no-borders">
          <Switch>
            <Route path={`${path}/rules/sales-rules`} component={RulesSales} />
            <Route path={`${path}/rules/retention-rules`} component={RulesRetention} />
            <If condition={branchInfo?.parentBranch?.deskType}>
              <Redirect to={`${path}/rules/${branchInfo.parentBranch.deskType.toLowerCase()}-rules`} />
            </If>
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRequests({
  branchInfoQuery: BranchInfoQuery,
})(TeamProfile);
