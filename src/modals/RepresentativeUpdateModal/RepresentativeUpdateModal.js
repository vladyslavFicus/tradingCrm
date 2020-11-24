import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { intersection } from 'lodash';
import { Formik, Field, Form } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withNotifications } from 'hoc';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { salesStatuses } from 'constants/salesStatuses';
import { retentionStatuses } from 'constants/retentionStatuses';
import { deskTypes, isLead } from 'constants/hierarchyTypes';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import renderLabel from 'utils/renderLabel';
import EventEmitter, { ACQUISITION_STATUS_CHANGED } from 'utils/EventEmitter';
import BulkUpdateClientsAcquisitionMutation from './graphql/BulkUpdateClientsAcquisitionMutation';
import BulkUpdateLeadsAcquisitionMutation from './graphql/BulkUpdateLeadsAcquisitionMutation';
import UpdateAcquisitionMutation from './graphql/UpdateAcquisitionMutation';
import OperatorsByTypeQuery from './graphql/OperatorsByTypeQuery';
import DesksAndTeamsQuery from './graphql/DesksAndTeamsQuery';

const attributeLabels = type => ({
  desk: `CLIENTS.MODALS.${type}_MODAL.DESK`,
  team: 'CLIENTS.MODALS.TEAM',
  operator: `CLIENTS.MODALS.${type}_MODAL.REPRESENTATIVE`,
  status: `CLIENTS.MODALS.${type}_MODAL.STATUS`,
  move: 'CLIENTS.MODALS.MOVE_MODAL.MOVE_LABEL',
});

class RepresentativeUpdateModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    desksAndTeamsQuery: PropTypes.query({
      userBranches: PropTypes.shape({
        DESK: PropTypes.arrayOf(PropTypes.branchHierarchyType),
        TEAM: PropTypes.arrayOf(PropTypes.branchHierarchyType),
      }),
    }).isRequired,
    operatorsByTypeQuery: PropTypes.query({
      usersByType: PropTypes.response({
        SALES_AGENT: PropTypes.arrayOf(PropTypes.userHierarchyType),
        SALES_HOD: PropTypes.arrayOf(PropTypes.userHierarchyType),
        SALES_MANAGER: PropTypes.arrayOf(PropTypes.userHierarchyType),
        SALES_LEAD: PropTypes.arrayOf(PropTypes.userHierarchyType),
        RETENTION_HOD: PropTypes.arrayOf(PropTypes.userHierarchyType),
        RETENTION_MANAGER: PropTypes.arrayOf(PropTypes.userHierarchyType),
        RETENTION_LEAD: PropTypes.arrayOf(PropTypes.userHierarchyType),
        RETENTION_AGENT: PropTypes.arrayOf(PropTypes.userHierarchyType),
      }),
    }).isRequired,
    updateLeadOrClientAcquisition: PropTypes.func.isRequired,
    bulkUpdateLeadsAcquisition: PropTypes.func.isRequired,
    bulkUpdateClientsAcquisition: PropTypes.func.isRequired,
    header: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
    type: PropTypes.oneOf(['SALES', 'RETENTION']).isRequired,
    userType: PropTypes.string, // LEAD_CUSTOMER or null - used only for leads
    configs: PropTypes.shape({ // used to bulk update list of leads/clients
      multiAssign: PropTypes.bool,
      allRowsSelected: PropTypes.bool,
      selectedRowsLength: PropTypes.number,
      searchParams: PropTypes.object,
      sorts: PropTypes.array,
    }),
    uuids: PropTypes.arrayOf(PropTypes.string), // used to bulk update list of leads/clients
    uuid: PropTypes.string, // used to update single lead/client
  };

  static defaultProps = {
    configs: {},
    uuids: [],
    uuid: null,
    userType: null,
    onSuccess: () => {},
  };

  // Sort operators by fullName
  sortOperators = operators => (
    operators.sort((a, b) => a.fullName.localeCompare(b.fullName))
  );

  // Filter operators by branch
  filterOperatorsByBranch = ({ operators, uuids }) => {
    const filteredOperators = operators.filter((operator) => {
      const partnerBranches = operator.operator?.hierarchy?.parentBranches || [];
      const branches = partnerBranches.map(({ uuid }) => uuid);

      return intersection(branches, uuids).length;
    });

    return this.sortOperators(filteredOperators);
  }

  // Filter operators by Sales/Retention type, parent desk and parent team
  getFilteredOperators = ({ desk, team }) => {
    const { type, operatorsByTypeQuery } = this.props;

    // Get an object with shape { operatorType: arrayOfOperatorsByType }
    const operatorsBySalesAndRetentionType = operatorsByTypeQuery.data?.usersByType || {};

    // Get an array of operators by 'type' from props
    const operators = [
      ...operatorsBySalesAndRetentionType[`${type}_AGENT`] || [],
      ...operatorsBySalesAndRetentionType[`${type}_HOD`] || [],
      ...operatorsBySalesAndRetentionType[`${type}_MANAGER`] || [],
      ...operatorsBySalesAndRetentionType[`${type}_LEAD`] || [],
    ];

    if (team) {
      return this.filterOperatorsByBranch({ operators, uuids: [team] });
    }

    if (desk) {
      // If desk choosen -> find all teams of the desk to filter operators
      const teamsUuids = this.getFilteredTeams(desk).map(({ uuid }) => uuid);

      return this.filterOperatorsByBranch({ operators, uuids: [desk, ...teamsUuids] });
    }

    return this.sortOperators(operators);
  }

  // Filter teams by parent deskType or selected desk
  getFilteredTeams = (deskUuid) => {
    const { desksAndTeamsQuery, type } = this.props;
    const allTeams = desksAndTeamsQuery.data?.userBranches?.TEAM || [];

    return deskUuid
      // Filter teams by deskUuid
      ? allTeams.filter(team => team.parentBranch?.uuid === deskUuid)
      // Filter teams by parentBranch deskType using 'type' prop (Sales / Retention)
      : allTeams.filter(team => team.parentBranch?.deskType === deskTypes[type]);
  }

  handleBranchChange = async (branchName, value, { desk }, setFieldValue) => {
    setFieldValue(branchName, value);

    switch (branchName) {
      // Autoselect team and operator on desk change
      case 'desk': {
        const teams = this.getFilteredTeams(value);
        const teamUuid = teams.length === 1 ? teams[0].uuid : null;
        const operators = this.getFilteredOperators({ desk: value, team: teamUuid });

        setFieldValue('team', value ? teamUuid : null);
        setFieldValue('operators', value ? operators[0]?.uuid : null);

        break;
      }
      // Autoselect operator on team change
      case 'team': {
        const operators = this.getFilteredOperators({ desk, team: value });

        setFieldValue('operators', operators[0]?.uuid);

        break;
      }
      default:
        break;
    }
  }

  // Function for single Lead / Client acquisition update
  handleSingleProfileAcquisitionUpdate = async (operatorUuid, status) => {
    const {
      uuid,
      type,
      notify,
      userType,
      onSuccess,
      onCloseModal,
      updateLeadOrClientAcquisition,
    } = this.props;

    const variables = {
      uuid,
      ...(type === deskTypes.SALES
        ? { salesStatus: status }
        : { retentionStatus: status }),
      ...(operatorUuid && { parentOperator: operatorUuid }),
    };

    try {
      await updateLeadOrClientAcquisition({ variables });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message:
          isLead(userType)
            ? I18n.t('LEADS.UPDATED')
            : I18n.t(`CLIENTS.${type}_INFO_UPDATED`),
      });

      onCloseModal();
      onSuccess();

      EventEmitter.emit(ACQUISITION_STATUS_CHANGED);
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.UPDATE_FAILED'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  // Function for bulk update Leads / Clients acquisitions
  handleBulkAcquisitionUpdate = async (operatorsUuids, status) => {
    const {
      type,
      uuids,
      notify,
      configs,
      userType,
      onSuccess,
      onCloseModal,
      bulkUpdateLeadsAcquisition,
      bulkUpdateClientsAcquisition,
    } = this.props;

    const { allRowsSelected, selectedRowsLength, searchParams, sorts } = configs;

    const variables = {
      uuids,
      ...(operatorsUuids && { parentOperators: operatorsUuids }),
      ...(type === deskTypes.SALES
        ? { salesStatus: status }
        : { retentionStatus: status }),
      ...allRowsSelected && {
        searchParams,
        sorts,
        bulkSize: selectedRowsLength,
      },
    };

    try {
      if (isLead(userType)) {
        await bulkUpdateLeadsAcquisition({ variables });
      } else {
        await bulkUpdateClientsAcquisition({ variables });
      }

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message:
          isLead(userType)
            ? I18n.t('LEADS.BULK_UPDATED')
            : I18n.t(`CLIENTS.BULK_${type}_INFO_UPDATED`),
      });

      onCloseModal();
      onSuccess();

      EventEmitter.emit(ACQUISITION_STATUS_CHANGED);
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.UPDATE_FAILED'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  handleSubmit = ({ operators, status }) => {
    const { uuid } = this.props;

    if (uuid) {
      // If we want to update single Lead / Client
      // In this case operators is a single operator uuid because multiselect prop -> false
      this.handleSingleProfileAcquisitionUpdate(operators, status);
    } else {
      // If we want to update a list of Leads / Clients
      // In this case operators is a list of operators uuids because multiselect prop -> true
      this.handleBulkAcquisitionUpdate(operators, status);
    }
  }

  render() {
    const {
      type,
      header,
      isOpen,
      onCloseModal,
      desksAndTeamsQuery,
      operatorsByTypeQuery,
      configs: { multiAssign },
    } = this.props;

    const allDesks = desksAndTeamsQuery.data?.userBranches?.DESK || [];

    // Filtering desks by type (Sales / Retention)
    const desks = allDesks.filter(({ deskType }) => deskType === deskTypes[type]);

    const isDesksAndTeamsLoading = desksAndTeamsQuery.loading;
    const isOperatorsLoading = operatorsByTypeQuery.loading;

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={{}}
          onSubmit={this.handleSubmit}
        >
          {({
            dirty,
            values,
            isSubmitting,
            setFieldValue,
          }) => {
            const teams = this.getFilteredTeams(values.desk);
            const operators = this.getFilteredOperators(values);

            return (
              <Form>
                <ModalHeader toggle={onCloseModal}>{header}</ModalHeader>

                <ModalBody>
                  <Field
                    name="desk"
                    label={I18n.t(attributeLabels(type).desk)}
                    placeholder={
                      !isDesksAndTeamsLoading && desks.length === 0
                        ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                        : I18n.t('COMMON.SELECT_OPTION.ANY')
                    }
                    disabled={isDesksAndTeamsLoading || desks.length === 0}
                    customOnChange={value => this.handleBranchChange('desk', value, values, setFieldValue)}
                    component={FormikSelectField}
                    withAnyOption
                    searchable
                  >
                    {desks.map(({ name, uuid }) => (
                      <option key={uuid} value={uuid}>
                        {name}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="team"
                    label={I18n.t(attributeLabels(type).team)}
                    placeholder={
                      !isDesksAndTeamsLoading && teams.length === 0
                        ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                        : I18n.t('COMMON.SELECT_OPTION.ANY')
                    }
                    disabled={isDesksAndTeamsLoading || teams.length === 0}
                    customOnChange={value => this.handleBranchChange('team', value, values, setFieldValue)}
                    component={FormikSelectField}
                    withAnyOption
                    searchable
                  >
                    {teams.map(({ name, uuid }) => (
                      <option key={uuid} value={uuid}>
                        {name}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="operators"
                    label={I18n.t(attributeLabels(type).operator)}
                    placeholder={
                      !isOperatorsLoading && operators.length === 0
                        ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                        : I18n.t('COMMON.SELECT_OPTION.ANY')
                    }
                    disabled={isOperatorsLoading || operators.length === 0}
                    component={FormikSelectField}
                    multiple={multiAssign}
                    searchable
                  >
                    {operators.map(({ fullName, uuid }) => (
                      <option key={uuid} value={uuid}>
                        {fullName}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="status"
                    label={I18n.t(attributeLabels(type).status)}
                    component={FormikSelectField}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    searchable
                  >
                    <Choose>
                      <When condition={type === deskTypes.SALES}>
                        {Object.keys(salesStatuses).map(value => (
                          <option key={value} value={value}>
                            {I18n.t(renderLabel(value, salesStatuses))}
                          </option>
                        ))}
                      </When>
                      <Otherwise>
                        {Object.keys(retentionStatuses).map(value => (
                          <option key={value} value={value}>
                            {I18n.t(renderLabel(value, retentionStatuses))}
                          </option>
                        ))}
                      </Otherwise>
                    </Choose>
                  </Field>
                </ModalBody>

                <ModalFooter>
                  <Button onClick={onCloseModal} commonOutline>
                    {I18n.t('COMMON.BUTTONS.CANCEL')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={!dirty || isSubmitting}
                    primary
                  >
                    {I18n.t('CLIENTS.MODALS.SUBMIT')}
                  </Button>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    operatorsByTypeQuery: OperatorsByTypeQuery,
    desksAndTeamsQuery: DesksAndTeamsQuery,
    updateLeadOrClientAcquisition: UpdateAcquisitionMutation,
    bulkUpdateLeadsAcquisition: BulkUpdateLeadsAcquisitionMutation,
    bulkUpdateClientsAcquisition: BulkUpdateClientsAcquisitionMutation,
  }),
)(RepresentativeUpdateModal);
