import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { withModals } from '../../../../../components/HighOrder';
import HierarchyInfoModal from '../../../../../components/HierarchyInfoModal';
import { getHierarchyUsersByType } from '../../../../../graphql/queries/hierarchy';
import { createOffice } from '../../../../../graphql/mutations/hierarchy';
import userTypes from '../../../../../constants/hierarchyTypes';
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
  graphql(getHierarchyUsersByType, {
    name: 'officeManagers',
    options: {
      variables: { userTypes: [userTypes.COMPANY_ADMIN, userTypes.BRAND_ADMIN] },
      fetchPolicy: 'network-only',
    },
  }),
)(List);
