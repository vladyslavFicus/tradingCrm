import { reduxForm } from 'redux-form';
import { get } from 'lodash';
import { compose, graphql } from 'react-apollo';
import { createValidator, translateLabels } from 'utils/validator';
import { withReduxFormValues } from 'components/HighOrder';
import { branchTypes as branchNames } from 'constants/hierarchyTypes';
import { getUserBranchHierarchy } from 'graphql/queries/hierarchy';
import CreateOperatorModal from './CreateOperatorModal';
import { attributeLabels, getBranchOption } from './constants';

export default compose(
  graphql(getUserBranchHierarchy, {
    name: 'branchHierarchy',
    options: ({ operatorId }) => ({
      variables: { userId: operatorId },
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
    form: 'operatorCreateForm',
    validate: createValidator({
      firstName: ['required', 'string', 'min:3'],
      lastName: ['required', 'string', 'min:3'],
      email: ['required', 'email'],
      phone: 'min:3',
      department: 'required',
      role: 'required',
    }, translateLabels(attributeLabels), false),
  }),
  withReduxFormValues,
)(CreateOperatorModal);
