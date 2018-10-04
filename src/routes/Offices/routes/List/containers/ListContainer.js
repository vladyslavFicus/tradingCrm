import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { withModals } from '../../../../../components/HighOrder';
import HierarchyInfoModal from '../../../../../components/HierarchyInfoModal';
// import { leadsQuery } from '../../../../../graphql/queries/leads';
import { createOffice } from '../../../../../graphql/mutations/hierarchy';
import { departments } from '../../../../../constants/brands';
import countries from '../../../../../utils/countryList';
import OfficeModal from '../components/OfficeModal';
import List from '../components/List';

const mapStateToProps = ({
  i18n: { locale },
  auth: { department, operatorHierarchy },
}) => ({
  locale,
  countries,
  auth: {
    isAdministration: department === departments.ADMINISTRATION,
    operatorHierarchy,
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
)(List);
