import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { withModals } from '../../../../../components/HighOrder';
import HierarchyInfoModal from '../../../../../components/HierarchyInfoModal';
import { getUserBranchHierarchy, getBranchHierarchy } from '../../../../../graphql/queries/hierarchy';
import { createDesk } from '../../../../../graphql/mutations/hierarchy';
import { branchTypes } from '../../../../../constants/hierarchyTypes';
import DeskModal from '../components/DeskModal';
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
    deskModal: DeskModal,
    infoModal: HierarchyInfoModal,
  }),
  connect(mapStateToProps),
  graphql(createDesk, {
    name: 'createDesk',
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
    name: 'desks',
    options: ({
      location: { query },
      auth: { userId },
    }) => ({
      variables: {
        ...query && query.filters,
        operatorId: userId,
        branchType: branchTypes.DESK.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(List);
