import React from 'react';
import { get } from 'lodash';
import compose from 'compose-function';
import { graphql } from '@apollo/client/react/hoc';
import { Switch, Redirect } from 'react-router-dom';
import { getBranchInfo } from 'graphql/queries/hierarchy';
import NotFound from 'routes/NotFound';
import PropTypes from 'constants/propTypes';
import Route from 'components/Route';
import Tabs from 'components/Tabs';
import BranchHeader from 'components/BranchHeader';
import HierarchyProfileRules from 'components/HierarchyProfileRules';

const officeProfileTabs = [{
  label: 'HIERARCHY.PROFILE_RULE_TAB.NAME',
  url: '/offices/:id/rules',
}];

const Rules = HierarchyProfileRules('OFFICES.TABS.RULES.TITLE', '', '');

const OfficeProfile = ({
  officeProfile,
  officeProfile: { loading },
  match: { params, path, url },
  location,
}) => {
  const data = get(officeProfile, 'branchInfo') || {};
  const error = get(officeProfile, 'error');

  if (error) {
    return <NotFound />;
  }

  return (
    <div className="profile">
      <div className="profile__info">
        <BranchHeader
          branchData={data}
          branchId={params.id}
          loading={loading}
        />
      </div>
      <Tabs
        items={officeProfileTabs}
        location={location}
        params={params}
      />
      <div className="card no-borders">
        <Switch>
          <Route path={`${path}/rules`} component={Rules} />
          <Redirect to={`${url}/rules`} />
        </Switch>
      </div>
    </div>
  );
};

OfficeProfile.propTypes = {
  officeProfile: PropTypes.shape({
    branchInfo: PropTypes.hierarchyBranch,
    loading: PropTypes.bool.isRequired,
    refetch: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default compose(
  graphql(getBranchInfo, {
    options: ({
      match: {
        params: {
          id: branchId,
        },
      },
    }) => ({
      variables: {
        branchId,
      },
    }),
    name: 'officeProfile',
  }),
)(OfficeProfile);
