import { reduxForm } from 'redux-form';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { updateUser } from 'graphql/mutations/hierarchy';
import { withNotifications } from 'components/HighOrder';
import { getUserBranchHierarchy } from 'graphql/queries/hierarchy';
import { branchTypes as branchNames } from 'constants/hierarchyTypes';
import HierarchyProfileForm from './HierarchyProfileForm';
import { getBranchOption } from './AddBranchForm/utils';

const FORM_NAME = 'HierarchyOperatorProfileForm';
const mapStateToProps = ({ auth: { uuid } }) => ({ userId: uuid });

export default compose(
  connect(mapStateToProps),
  withRouter,
  withNotifications,
  graphql(updateUser, {
    name: 'updateOperatorHierarchy',
  }),
  graphql(getUserBranchHierarchy, {
    name: 'branchHierarchy',
    options: ({ userId }) => ({
      variables: { userId, withoutBrandFilter: true },
      fetchPolicy: 'network-only',
    }),
    props: ({ branchHierarchy: { hierarchy, loading } }) => {
      const TEAM = get(hierarchy, 'userBranchHierarchy.data.TEAM') || [];
      const DESK = get(hierarchy, 'userBranchHierarchy.data.DESK') || [];
      const OFFICE = get(hierarchy, 'userBranchHierarchy.data.OFFICE') || [];
      const BRAND = get(hierarchy, 'userBranchHierarchy.data.BRAND') || [];

      const branchTypes = [
        ...(TEAM.length ? getBranchOption(branchNames.TEAM) : []),
        ...(DESK.length ? getBranchOption(branchNames.DESK) : []),
        ...(OFFICE.length ? getBranchOption(branchNames.OFFICE) : []),
        ...(BRAND.length ? getBranchOption(branchNames.BRAND) : []),
      ];

      return {
        branchHierarchy: {
          loading,
          TEAM,
          DESK,
          OFFICE,
          BRAND,
          branchTypes,
        },
      };
    },
  }),
  reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
  }),
)(HierarchyProfileForm);
