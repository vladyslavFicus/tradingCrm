import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { withModals } from '../../../../../components/HighOrder';
import HierarchyInfoModal from '../../../../../components/HierarchyInfoModal';
import { getUserBranchHierarchy, getBranchHierarchy } from '../../../../../graphql/queries/hierarchy';
import { createTeam } from '../../../../../graphql/mutations/hierarchy';
import { branchTypes } from '../../../../../constants/hierarchyTypes';
import TeamModal from '../components/TeamModal';
import List from '../components/List';

const mapStateToProps = ({
  i18n: { locale },
  auth: { uuid: userId },
}) => ({
  locale,
  auth: {
    userId,
  },
});

export default compose(
  withModals({
    teamModal: TeamModal,
    infoModal: HierarchyInfoModal,
  }),
  connect(mapStateToProps),
  graphql(createTeam, {
    name: 'createTeam',
  }),
  graphql(getUserBranchHierarchy, {
    name: 'userBranchHierarchy',
    options: ({
      auth: { userId },
    }) => ({
      variables: { userId },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(getBranchHierarchy, {
    name: 'teams',
    options: ({
      location: { query },
      auth: { userId },
    }) => ({
      variables: {
        ...query && query.filters,
        operatorId: userId,
        branchType: branchTypes.TEAM.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(List);
