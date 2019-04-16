import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { withApollo, graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { createValidator, translateLabels } from '../../utils/validator';
import { salesStatusValues } from '../../constants/salesStatuses';
import { retentionStatusValues } from '../../constants/retentionStatuses';
import { userTypes } from '../../constants/hierarchyTypes';
import { clientsBulkRepresentativeUpdate } from '../../graphql/mutations/profile';
import { bulkLeadUpdate } from '../../graphql/mutations/leads';
import { getHierarchyUsersByType, getUserBranchHierarchy } from '../../graphql/queries/hierarchy';
import { withNotifications } from '../HighOrder';
import RepresentativeUpdateModal from './RepresentativeUpdateModal';
import { attributeLabels, getAgents, fieldNames } from './constants';

const FORM_NAME = 'representativeUpdateModalForm';
const selector = formValueSelector(FORM_NAME);

const mapStateToProps = state => ({
  auth: { uuid: state.auth.uuid },
  selectedDesk: selector(state, fieldNames.DESK),
  selectedTeam: selector(state, fieldNames.TEAM),
  selectedRep: selector(state, fieldNames.REPRESENTATIVE),
  selectedAcquisition: selector(state, fieldNames.ACQUISITION),
  currentStatus: selector(state, fieldNames.STATUS),
});

export default compose(
  withApollo,
  withNotifications,
  connect(mapStateToProps),
  graphql(clientsBulkRepresentativeUpdate, {
    name: 'bulkRepresentativeUpdate',
    options: { refetchQueries: () => ['getProfiles'] },
  }),
  graphql(bulkLeadUpdate, {
    name: 'bulkLeadRepresentativeUpdate',
  }),
  graphql(getHierarchyUsersByType, {
    name: 'hierarchyUsers',
    options: {
      variables: {
        userTypes: [
          userTypes.SALES_AGENT,
          userTypes.SALES_HOD,
          userTypes.SALES_MANAGER,
          userTypes.SALES_LEAD,
          userTypes.RETENTION_HOD,
          userTypes.RETENTION_MANAGER,
          userTypes.RETENTION_LEAD,
          userTypes.RETENTION_AGENT,
        ],
        onlyActive: true,
      },
      fetchPolicy: 'network-only',
    },
  }),
  graphql(getUserBranchHierarchy, {
    name: 'userBranchHierarchy',
    options: ({
      auth: { uuid },
    }) => ({
      variables: { userId: uuid },
      fetchPolicy: 'network-only',
    }),
  }),
  reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    validate: (values, { userBranchHierarchy, hierarchyUsers, type }) => {
      const desks = get(userBranchHierarchy, 'hierarchy.userBranchHierarchy.data.DESK') || [];
      const users = getAgents(hierarchyUsers, type) || [];

      return createValidator({
        deskId: [`in:,${desks.map(({ uuid }) => uuid).join()}`],
        repId: [`in:,${users.map(({ uuid }) => uuid).join()}`],
        teamId: ['string'],
        aquisitionStatus: ['string'],
        status: [`in:,${[...Object.values(salesStatusValues), ...Object.values(retentionStatusValues)].join()}`],
      }, translateLabels(attributeLabels(type)), false)(values);
    },
  }),
)(RepresentativeUpdateModal);
