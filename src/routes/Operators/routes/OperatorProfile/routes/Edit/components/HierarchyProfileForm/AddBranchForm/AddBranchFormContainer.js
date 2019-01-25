import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { withNotifications } from 'components/HighOrder';
import { addOperatorToBranch } from 'graphql/mutations/hierarchy';
import { getUserBranchHierarchy } from 'graphql/queries/hierarchy';
import { branchTypes as branchNames } from 'constants/hierarchyTypes';
import AddBranchForm from './AddBranchForm';
import { getBranchOption } from './utils';

const FORM_NAME = 'HierarchyOperatorProfileAddBranchForm';

const mapStateToProps = ({ auth: { uuid } }) => ({ userId: uuid });

export default compose(
  connect(mapStateToProps),
  withRouter,
  withNotifications,
  reduxForm({
    form: FORM_NAME,
  }),
  graphql(addOperatorToBranch, {
    name: 'addOperatorToBranch',
  }),
  graphql(getUserBranchHierarchy, {
    name: 'branchHierarchy',
    options: ({ userId }) => ({
      variables: { userId },
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
)(AddBranchForm);
