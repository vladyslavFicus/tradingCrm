import { graphql, compose } from 'react-apollo';
import { withModals } from 'components/HighOrder';
import HierarchyInfoModal from 'components/HierarchyInfoModal';
import { getBranchHierarchy } from 'graphql/queries/hierarchy';
import { createOffice } from 'graphql/mutations/hierarchy';
import { branchTypes } from 'constants/hierarchyTypes';
import OfficeModal from '../components/OfficeModal';
import List from '../components/List';

export default compose(
  withModals({
    officeModal: OfficeModal,
    infoModal: HierarchyInfoModal,
  }),
  graphql(createOffice, {
    name: 'createOffice',
  }),
  graphql(getBranchHierarchy, {
    name: 'offices',
    options: ({
      location: { query },
    }) => ({
      variables: {
        ...query && query.filters,
        branchType: branchTypes.OFFICE.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(List);
