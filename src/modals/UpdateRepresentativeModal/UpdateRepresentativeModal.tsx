import React from 'react';
import I18n from 'i18n-js';
import { intersection, sortBy } from 'lodash';
import { Formik, Field, Form } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getBrand } from 'config';
import { Sorts } from 'types';
import { SetFieldValue } from 'types/formik';
import {
  AcquisitionStatusTypes__Enum as AcquisitionStatusTypes,
  ClientSearch__Input as ClientSearch,
  LeadSearch__Input as LeadSearch,
} from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { salesStatuses as staticSalesStatuses } from 'constants/salesStatuses';
import { retentionStatuses as staticRetentionStatuses } from 'constants/retentionStatuses';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import EventEmitter, { ACQUISITION_STATUS_CHANGED } from 'utils/EventEmitter';
import { useOperatorsSubordinatesQuery } from './graphql/__generated__/OperatorsSubordinatesQuery';
import { useDesksTeamsQuery } from './graphql/__generated__/DesksTeamsQuery';
import { useAcquisitionStatusesQuery } from './graphql/__generated__/AcquisitionStatusesQuery';
import { useBulkUpdateClientsAcquisitionMutation } from './graphql/__generated__/BulkUpdateClientsAcquisitionMutation';
import { useBulkUpdateLeadsAcquisitionMutation } from './graphql/__generated__/BulkUpdateLeadsAcquisitionMutation';
import {
  useUpdateAcquisitionMutation,
  UpdateAcquisitionMutationVariables,
} from './graphql/__generated__/UpdateAcquisitionMutation';

const attributeLabels = (type: string) => ({
  desk: `CLIENTS.MODALS.${type}_MODAL.DESK`,
  team: 'CLIENTS.MODALS.TEAM',
  operator: `CLIENTS.MODALS.${type}_MODAL.REPRESENTATIVE`,
  status: `CLIENTS.MODALS.${type}_MODAL.STATUS`,
  move: 'CLIENTS.MODALS.MOVE_MODAL.MOVE_LABEL',
});

type Configs = {
  multiAssign: boolean,
  allRowsSelected: boolean,
  searchParams: Object,
  selectedRowsLength: number,
  sorts: Sorts,
};

type FormValues = {
  desk: string,
  team: string,
  operators: Array<string> | string,
  status: string,
};

export type Props = {
  type: AcquisitionStatusTypes,
  header: React.ReactNode,
  isClient?: boolean,
  uuid?: string,
  uuids?: Array<string>,
  configs?: Configs,
  onCloseModal: () => void,
  onSuccess?: () => void,
};

const UpdateRepresentativeModal = (props: Props) => {
  const { type, header, isClient, uuid, uuids, configs, onCloseModal, onSuccess } = props;

  const {
    allRowsSelected = false,
    selectedRowsLength = 0,
    searchParams = {},
    sorts = [],
    multiAssign = false,
  } = configs || {};

  // ===== Requests ===== //
  const operatorsSubordinatesQuery = useOperatorsSubordinatesQuery({ variables: { hierarchyTypeGroup: type } });
  const isOperatorsLoading = operatorsSubordinatesQuery.loading;
  const operatorsList = operatorsSubordinatesQuery.data?.operatorsSubordinates || [];

  const desksTeamsQuery = useDesksTeamsQuery();
  const isDesksTeamsLoading = desksTeamsQuery.loading;
  const allTeams = desksTeamsQuery.data?.userBranches?.TEAM || [];
  const allDesks = desksTeamsQuery.data?.userBranches?.DESK || [];
  const desks = allDesks.filter(({ deskType }) => deskType?.toString() === AcquisitionStatusTypes[type]);

  const acquisitionStatusesQuery = useAcquisitionStatusesQuery({ variables: { brandId: getBrand().id } });
  const isAcquisitionStatusesLoading = acquisitionStatusesQuery.loading;
  const salesStatuses = sortBy(acquisitionStatusesQuery.data?.settings.salesStatuses || [], 'status');
  const retentionStatuses = sortBy(acquisitionStatusesQuery.data?.settings.retentionStatuses || [], 'status');

  const [bulkUpdateClientsAcquisitionMutation] = useBulkUpdateClientsAcquisitionMutation();
  const [bulkUpdateLeadsAcquisitionMutation] = useBulkUpdateLeadsAcquisitionMutation();
  const [updateAcquisitionMutation] = useUpdateAcquisitionMutation();

  // Filter operators by branch
  const filterOperatorsByBranch = (branchFilterUuids: Array<string>) => {
    const filteredOperators = operatorsList.filter((operator) => {
      const partnerBranches = operator?.hierarchy?.parentBranches || [];
      const branchesUuids = partnerBranches.map(item => item.uuid);

      return intersection(branchesUuids, branchFilterUuids).length;
    });

    return filteredOperators.slice().sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));
  };

  // Filter teams by parent deskType or selected desk
  const getFilteredTeams = (deskUuid: string) => {
    const teams = deskUuid
      // Filter teams by deskUuid
      ? allTeams.filter(team => team.parentBranch?.uuid === deskUuid)
      // Filter teams by parentBranch deskType using 'type' prop (Sales / Retention)
      : allTeams.filter(team => team.parentBranch?.deskType?.toString() === AcquisitionStatusTypes[type]);
    return teams;
  };

  // Filter operators by Sales/Retention type, parent desk and parent team
  const getFilteredOperators = (deskId: string, teamId: string) => {
    if (teamId) {
      return filterOperatorsByBranch([teamId]);
    }

    if (deskId) {
      // If desk choosen -> find all teams of the desk to filter operators
      const teamsUuids = getFilteredTeams(deskId).map(team => team.uuid);

      return filterOperatorsByBranch([deskId, ...teamsUuids]);
    }

    return operatorsList.slice().sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));
  };

  // Function for single Lead / Client acquisition update
  const handleUpdateAcquisition = async (id: string, parentOperator: string, status: string) => {
    const variables = {
      uuid: id,
      parentOperator,
      ...(type === AcquisitionStatusTypes.SALES && status && { salesStatus: status }),
      ...(type === AcquisitionStatusTypes.RETENTION && status && { retentionStatus: status }),
    };

    try {
      await updateAcquisitionMutation({ variables: variables as UpdateAcquisitionMutationVariables });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message:
          isClient
            ? I18n.t(`CLIENTS.${type}_INFO_UPDATED`)
            : I18n.t('LEADS.UPDATED'),
      });

      onCloseModal();
      onSuccess?.();

      EventEmitter.emit(ACQUISITION_STATUS_CHANGED);
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.UPDATE_FAILED'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  // Function for bulk update Leads / Clients acquisitions
  const handleBulkUpdateAcquisition = async (ids: Array<string>, parentOperators: Array<string>, status: string) => {
    const filter = allRowsSelected ? searchParams : null;

    const commonVariables = {
      uuids: ids,
      parentOperators,
      salesStatus: type === AcquisitionStatusTypes.SALES ? status : null,
      retentionStatus: type === AcquisitionStatusTypes.RETENTION ? status : null,
      sorts: allRowsSelected ? sorts : null,
      bulkSize: allRowsSelected ? selectedRowsLength : null,
    };

    try {
      if (isClient) {
        const variables = { ...commonVariables, searchParams: filter as ClientSearch };
        await bulkUpdateClientsAcquisitionMutation({ variables });
      } else {
        const variables = { ...commonVariables, searchParams: filter as LeadSearch };
        await bulkUpdateLeadsAcquisitionMutation({ variables });
      }

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message:
          isClient
            ? I18n.t(`CLIENTS.BULK_${type}_INFO_UPDATED`)
            : I18n.t('LEADS.BULK_UPDATED'),
      });

      onCloseModal();
      onSuccess?.();

      EventEmitter.emit(ACQUISITION_STATUS_CHANGED);
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.UPDATE_FAILED'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  // ===== Handlers ===== //
  const handleSubmit = ({ operators, status }: FormValues) => {
    if (uuid) {
      // If we want to update single Lead / Client
      // In this case operators is a single operator uuid because multiselect prop -> false
      handleUpdateAcquisition(uuid, operators as string, status);
    } else if (uuids) {
      // If we want to update a list of Leads / Clients
      // In this case operators is a list of operators uuids because multiselect prop -> true
      handleBulkUpdateAcquisition(uuids, operators as Array<string>, status);
    }
  };

  const handleBranchChange = async (
    branchName: string,
    value: string,
    { desk }: FormValues,
    setFieldValue: SetFieldValue<FormValues>,
  ) => {
    setFieldValue(branchName, value);

    switch (branchName) {
      // Autoselect team and operator on desk change
      case 'desk': {
        const teams = getFilteredTeams(value);
        const teamUuid = teams.length === 1 ? teams[0].uuid : '';
        const filteredOperators = getFilteredOperators(value, teamUuid);

        setFieldValue('team', teamUuid);
        setFieldValue('operators', value ? filteredOperators[0]?.uuid : '');

        break;
      }
      // Autoselect operator on team change
      case 'team': {
        const filteredOperators = getFilteredOperators(desk, value);

        setFieldValue('operators', filteredOperators[0]?.uuid);

        break;
      }
      default:
        break;
    }
  };

  return (
    <Modal toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          desk: '',
          team: '',
          operators: multiAssign ? [] : '',
          status: '',
        }}
        onSubmit={handleSubmit}
      >
        {({ dirty, values, isSubmitting, setFieldValue }) => {
          const teams = getFilteredTeams(values.desk);
          const filteredOperators = getFilteredOperators(values.desk, values.team);

          return (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {header}
              </ModalHeader>

              <ModalBody>
                <Field
                  name="desk"
                  label={I18n.t(attributeLabels(type).desk)}
                  placeholder={
                    !isDesksTeamsLoading && !desks.length
                      ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                      : I18n.t('COMMON.SELECT_OPTION.ANY')
                  }
                  disabled={isDesksTeamsLoading || !desks.length}
                  customOnChange={(value: string) => handleBranchChange('desk', value, values, setFieldValue)}
                  component={FormikSelectField}
                  withAnyOption
                  searchable
                >
                  {desks.map(desk => (
                    <option key={desk.uuid} value={desk.uuid}>
                      {desk.name}
                    </option>
                  ))}
                </Field>

                <Field
                  name="team"
                  label={I18n.t(attributeLabels(type).team)}
                  placeholder={
                    !isDesksTeamsLoading && !teams.length
                      ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                      : I18n.t('COMMON.SELECT_OPTION.ANY')
                  }
                  disabled={isDesksTeamsLoading || !teams.length}
                  customOnChange={(value: string) => handleBranchChange('team', value, values, setFieldValue)}
                  component={FormikSelectField}
                  withAnyOption
                  searchable
                >
                  {teams.map(team => (
                    <option key={team.uuid} value={team.uuid}>
                      {team.name}
                    </option>
                  ))}
                </Field>

                <Field
                  name="operators"
                  label={I18n.t(attributeLabels(type).operator)}
                  placeholder={
                    !isOperatorsLoading && !filteredOperators.length
                      ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                      : I18n.t('COMMON.SELECT_OPTION.ANY')
                  }
                  disabled={isOperatorsLoading || !filteredOperators.length}
                  component={FormikSelectField}
                  multiple={multiAssign}
                  searchable
                >
                  {filteredOperators.map(operator => (
                    <option key={operator.uuid} value={operator.uuid}>
                      {operator.fullName}
                    </option>
                  ))}
                </Field>

                <Field
                  name="status"
                  label={I18n.t(attributeLabels(type).status)}
                  component={FormikSelectField}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  disabled={isAcquisitionStatusesLoading}
                  searchable
                >
                  <Choose>
                    <When condition={type === AcquisitionStatusTypes.SALES}>
                      {salesStatuses.map(({ status }) => (
                        <option key={status} value={status}>
                          {I18n.t(staticSalesStatuses[status])}
                        </option>
                      ))}
                    </When>

                    <Otherwise>
                      {retentionStatuses.map(({ status }) => (
                        <option key={status} value={status}>
                          {I18n.t(staticRetentionStatuses[status])}
                        </option>
                      ))}
                    </Otherwise>
                  </Choose>
                </Field>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onCloseModal} tertiary>
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
};

export default React.memo(UpdateRepresentativeModal);
