import React from 'react';
import I18n from 'i18n-js';
import { intersection, sortBy } from 'lodash';
import { Formik, Field, Form } from 'formik';
import { Config, Constants, notify, Types } from '@crm/common';
import {
  AcquisitionStatusTypes__Enum as AcquisitionStatusTypes,
  ClientSearch__Input as ClientSearch,
  LeadSearch__Input as LeadSearch,
} from '__generated__/types';
import { FormikSingleSelectField } from 'components';
import Modal from 'components/Modal';
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
  sorts: Types.Sorts,
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

  const acquisitionStatusesQuery = useAcquisitionStatusesQuery({ variables: { brandId: Config.getBrand().id } });
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
      ...(parentOperator && { parentOperator }),
      ...(type === AcquisitionStatusTypes.SALES && status && { salesStatus: status }),
      ...(type === AcquisitionStatusTypes.RETENTION && status && { retentionStatus: status }),
    };

    try {
      await updateAcquisitionMutation({ variables: variables as UpdateAcquisitionMutationVariables });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message:
          isClient
            ? I18n.t(`CLIENTS.${type}_INFO_UPDATED`)
            : I18n.t('LEADS.UPDATED'),
      });

      onSuccess?.();
      onCloseModal();
    } catch {
      notify({
        level: Types.LevelType.ERROR,
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
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message:
          isClient
            ? I18n.t(`CLIENTS.BULK_${type}_INFO_UPDATED`)
            : I18n.t('LEADS.BULK_UPDATED'),
      });

      onSuccess?.();
      onCloseModal();
    } catch {
      notify({
        level: Types.LevelType.ERROR,
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
    setFieldValue: Types.SetFieldValue<FormValues>,
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
    <Formik
      initialValues={{
        desk: '',
        team: '',
        operators: multiAssign ? [] : '',
        status: '',
      }}
      onSubmit={handleSubmit}
    >
      {({ dirty, values, isSubmitting, setFieldValue, submitForm }) => {
        const teams = getFilteredTeams(values.desk);
        const filteredOperators = getFilteredOperators(values.desk, values.team);

        return (
          <Modal
            onCloseModal={onCloseModal}
            title={(
              <div className="UpdateRepresentativeModal__header">
                {header}
              </div>
            )}
            buttonTitle={I18n.t('CLIENTS.MODALS.SUBMIT')}
            disabled={!dirty || isSubmitting}
            clickSubmit={submitForm}
          >
            <Form>
              <Field
                withAnyOption
                searchable
                name="desk"
                data-testid="UpdateRepresentativeModal-deskSelect"
                label={I18n.t(attributeLabels(type).desk)}
                placeholder={
                    !isDesksTeamsLoading && !desks.length
                      ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                      : I18n.t('COMMON.SELECT_OPTION.ANY')
                  }
                disabled={isDesksTeamsLoading || !desks.length}
                onChange={(value: string) => handleBranchChange('desk', value, values, setFieldValue)}
                component={FormikSingleSelectField}
                options={desks.map(desk => ({
                  label: desk.name,
                  value: desk.uuid,
                }))}
              />

              <Field
                withAnyOption
                searchable
                name="team"
                data-testid="UpdateRepresentativeModal-teamSelect"
                label={I18n.t(attributeLabels(type).team)}
                placeholder={
                    !isDesksTeamsLoading && !teams.length
                      ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                      : I18n.t('COMMON.SELECT_OPTION.ANY')
                  }
                disabled={isDesksTeamsLoading || !teams.length}
                onChange={(value: string) => handleBranchChange('team', value, values, setFieldValue)}
                component={FormikSingleSelectField}
                options={teams.map(team => ({
                  label: team.name,
                  value: team.uuid,
                }))}
              />

              <Field
                searchable
                name="operators"
                data-testid="UpdateRepresentativeModal-operatorsSelect"
                label={I18n.t(attributeLabels(type).operator)}
                placeholder={
                    !isOperatorsLoading && !filteredOperators.length
                      ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                      : I18n.t('COMMON.SELECT_OPTION.ANY')
                  }
                disabled={isOperatorsLoading || !filteredOperators.length}
                component={FormikSingleSelectField}
                multiple={multiAssign}
                options={filteredOperators.map(operator => ({
                  label: operator.fullName,
                  value: operator.uuid,
                }))}
              />

              <Field
                searchable
                name="status"
                data-testid="UpdateRepresentativeModal-statusSelect"
                label={I18n.t(attributeLabels(type).status)}
                component={FormikSingleSelectField}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                disabled={isAcquisitionStatusesLoading}
                options={type === AcquisitionStatusTypes.SALES
                  ? salesStatuses.map(({ status }) => ({
                    label: I18n.t(Constants.salesStatuses[status]),
                    value: status,
                  }))
                  : retentionStatuses.map(({ status }) => ({
                    label: I18n.t(Constants.retentionStatuses[status]),
                    value: status,
                  }))
              }
              />
            </Form>
          </Modal>
        );
      }}
    </Formik>
  );
};

export default React.memo(UpdateRepresentativeModal);
