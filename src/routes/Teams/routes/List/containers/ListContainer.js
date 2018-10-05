import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { withModals } from '../../../../../components/HighOrder';
import HierarchyInfoModal from '../../../../../components/HierarchyInfoModal';
import { getUserBranchHierarchy } from '../../../../../graphql/queries/hierarchy';
import { createTeam } from '../../../../../graphql/mutations/hierarchy';
import { departments } from '../../../../../constants/brands';
import TeamModal from '../components/TeamModal';
import List from '../components/List';

const mapStateToProps = ({
  i18n: { locale },
  auth: { department, uuid: userId },
}) => ({
  locale,
  auth: {
    isAdministration: department === departments.ADMINISTRATION,
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
  })
)(List);
