import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { withModals } from '../../../../../components/HighOrder';
import HierarchyInfoModal from '../../../../../components/HierarchyInfoModal';
import { getHierarchyUsersByType, getBranchHierarchy } from '../../../../../graphql/queries/hierarchy';
import { createOffice } from '../../../../../graphql/mutations/hierarchy';
import { userTypes, branchTypes } from '../../../../../constants/hierarchyTypes';
import { departments } from '../../../../../constants/brands';
import countries from '../../../../../utils/countryList';
import OfficeModal from '../components/OfficeModal';
import List from '../components/List';

const mapStateToProps = ({
  i18n: { locale },
  auth: { department, uuid },
}) => ({
  locale,
  countries,
  auth: {
    isAdministration: department === departments.ADMINISTRATION,
    operatorId: uuid,
  },
});

export default compose(
  withModals({
    officeModal: OfficeModal,
    infoModal: HierarchyInfoModal,
  }),
  connect(mapStateToProps),
  graphql(createOffice, {
    name: 'createOffice',
  }),
  graphql(getBranchHierarchy, {
    name: 'offices',
    options: ({
      location: { query },
      auth: { operatorId },
    }) => ({
      variables: {
        ...query && query.filters,
        operatorId,
        branchType: branchTypes.OFFICE.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(List);
