import React from 'react';
import { get } from 'lodash';
import { Switch, Redirect } from 'react-router-dom';
import { Route } from '../../../../../router';
import Tabs from '../../../../../components/Tabs';
import NotFound from '../../../../NotFound';
import PropTypes from '../../../../../constants/propTypes';
import HierarchyProfileRules from '../../../../../components/HierarchyProfileRules';
import officeProfileTabs from './constants';
import Header from './Header';

const Rules = HierarchyProfileRules('OFFICES.TABS.RULES.TITLE');

const OfficeProfile = ({
  officeProfile: {
    hierarchy,
    loading,
  },
  location,
  match: { params, path, url },
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

export default OfficeProfile;
