import React from 'react';
import { get } from 'lodash';
import { Switch } from 'react-router-dom';
import { branchTypes } from 'constants/hierarchyTypes';
import Route from 'components/Route';
import Tabs from 'components/Tabs';
import HierarchyProfileRules from 'components/HierarchyProfileRules';
import NotFound from 'routes/NotFound';
import PropTypes from 'constants/propTypes';
import { deskTypes } from 'constants/rules';
import teamProfileTabs from './constants';
import Header from './Header';

const RulesRetention = HierarchyProfileRules('TEAMS.TABS.RULES.TITLE', deskTypes.RETENTION, branchTypes.TEAM);
const RulesSales = HierarchyProfileRules('TEAMS.TABS.RULES.TITLE', deskTypes.SALES, branchTypes.TEAM);

const TeamProfile = ({
  teamProfile: {
    hierarchy,
    loading,
  },
  location,
  match: { params, path },
}) => {
  const data = get(hierarchy, 'branchInfo.data') || {};
  const error = get(hierarchy, 'branchInfo.error');

  if (error) {
    return <NotFound />;
  }

  return (
    <div className="profile">
      <div className="profile__info">
        <Header
          data={data}
          loading={loading}
        />
      </div>
      <Tabs
        items={teamProfileTabs}
        location={location}
        params={params}
      />
      <div className="card no-borders">
        <Switch>
          <Route path={`${path}/rules/sales-rules`} component={RulesSales} />
          <Route path={`${path}/rules/retention-rules`} component={RulesRetention} />
        </Switch>
      </div>
    </div>
  );
};

TeamProfile.propTypes = {
  teamProfile: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    hierarchy: PropTypes.shape({
      branchInfo: PropTypes.shape({
        data: PropTypes.hierarchyBranch,
        error: PropTypes.object,
      }),
    }),
    refetch: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default TeamProfile;
