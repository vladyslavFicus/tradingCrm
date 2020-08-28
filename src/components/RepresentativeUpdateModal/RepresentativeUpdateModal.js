import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withApollo, compose } from 'react-apollo';
import { Formik, Field, Form } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withNotifications } from 'hoc';
import { withRequests, parseErrors } from 'apollo';
import PropTypes from 'constants/propTypes';
import { deskTypes, userTypes } from 'constants/hierarchyTypes';
import { salesStatuses, salesStatusValues } from 'constants/salesStatuses';
import {
  retentionStatuses,
  retentionStatusValues,
} from 'constants/retentionStatuses';
import { Button } from 'components/UI';
import { FormikSelectField } from 'components/Formik';
import renderLabel from 'utils/renderLabel';
import EventEmitter, { ACQUISITION_STATUS_CHANGED } from 'utils/EventEmitter';
import { createValidator, translateLabels } from 'utils/validator';
import {
  attributeLabels,
  getAgents,
  filterAgents,
  fieldNames,
} from './constants';
import {
  HierarchyUsersByTypeQuery,
  UserBranchHierarchyQuery,
  UpdateAcquisition,
  BulkUpdateLeadsAcquisition,
  BulkUpdateClientsAcquisition,
  getBranchChildren,
  getUsersByBranch,
} from './graphql';

const validate = (values, { desks, users, type }) => (
  createValidator({
    deskId: [`in:,${desks.map(({ uuid }) => uuid).join()}`],
    repId: [`in:,${users.map(({ uuid }) => uuid).join()}`],
    teamId: ['string'],
    status: [`in:,${[...Object.values(salesStatusValues), ...Object.values(retentionStatusValues)].join()}`],
  }, translateLabels(attributeLabels(type)), false)(values)
);

class RepresentativeUpdateModal extends PureComponent {
  static propTypes = {
    client: PropTypes.object.isRequired,
    notify: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    hierarchyUsersByTypeQuery: PropTypes.query({
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
    userBranchHierarchyQuery: PropTypes.query({
      userBranches: PropTypes.shape({
        DESK: PropTypes.arrayOf(PropTypes.branchHierarchyType),
      }),
    }).isRequired,
    updateAcquisition: PropTypes.func.isRequired,
    bulkUpdateLeadsAcquisition: PropTypes.func.isRequired,
    bulkUpdateClientsAcquisition: PropTypes.func.isRequired,
    header: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
    type: PropTypes.string.isRequired,
    userType: PropTypes.string,
    onSuccess: PropTypes.func,
    initialValues: PropTypes.object,
    configs: PropTypes.shape({
      multiAssign: PropTypes.bool,
      allRowsSelected: PropTypes.bool,
      selectedRowsLength: PropTypes.number,
      searchParams: PropTypes.object,
    }),
    uuids: PropTypes.arrayOf(PropTypes.string),
    uuid: PropTypes.string,
  };

  static defaultProps = {
    initialValues: {},
    configs: {},
    uuids: [],
    uuid: null,
    userType: null,
    onSuccess: () => {},
  };

  static getDerivedStateFromProps(
    { hierarchyUsersByTypeQuery, type },
    prevState,
  ) {
    const agents = getAgents(hierarchyUsersByTypeQuery, type);

    if (agents && !prevState.agents) {
      return { agents };
    }

    return null;
  }

  state = {
    agentsLoading: false,
    teamsLoading: false,
    agents: null,
    teams: [],
  };

  loadAgents = async (
    branchUuid,
    {
      setFieldValue,
      setFieldError,
      setSubmitting,
      values,
    },
  ) => {
    const { client, type } = this.props;

    this.setState({ agentsLoading: true });

    setSubmitting(true);

    try {
      const { data: { usersByBranch } } = await client.query({
        query: getUsersByBranch,
        variables: {
          onlyActive: true,
          uuids: [branchUuid],
        },
      });

      setSubmitting(false);

      const agents = filterAgents(usersByBranch || [], type);

      if (agents && agents.length >= 1) {
        if (values[fieldNames.REPRESENTATIVE]) {
          let repIncludesAgents = false;
          agents.forEach((agent) => {
            if (values[fieldNames.REPRESENTATIVE].includes(agent.uuid)) {
              repIncludesAgents = true;
            }
          });
          if (!repIncludesAgents) {
            setFieldValue(fieldNames.REPRESENTATIVE, agents[0].uuid);
          }
        } else {
          setFieldValue(fieldNames.REPRESENTATIVE, agents[0].uuid);
        }
      }

      this.setState({
        agents,
        agentsLoading: false,
      });
    } catch (e) {
      const error = parseErrors(e);

      this.setState({ agentsLoading: false });
      setFieldError(fieldNames.REPRESENTATIVE, error.error);
    }
  }

  handleDeskChange = async (
    selectedDesk,
    {
      setFieldValue,
      setFieldError,
      setSubmitting,
      values,
    },
  ) => {
    this.setState({ teamsLoading: true });

    if (!selectedDesk) {
      this.setState({
        teams: [],
        agents: null,
      });

      setFieldValue(fieldNames.REPRESENTATIVE, null);
      setFieldValue(fieldNames.DESK, null);
      setFieldValue(fieldNames.TEAM, null);

      return;
    }

    setSubmitting(true);

    try {
      const {
        data: {
          branchChildren: teams,
        },
      } = await this.props.client.query({
        query: getBranchChildren,
        variables: { uuid: selectedDesk },
      });

      setFieldValue(fieldNames.DESK, selectedDesk);

      if (teams?.length === 1) {
        await this.handleTeamChange(
          teams[0].uuid,
          {
            setFieldValue,
            setFieldError,
            setSubmitting,
            values,
          },
        );
      } else {
        setFieldValue(fieldNames.TEAM, null);
        setFieldValue(fieldNames.REPRESENTATIVE, null);
        this.loadAgents(
          selectedDesk,
          {
            setFieldValue,
            setFieldError,
            setSubmitting,
            values,
          },
        );
      }

      this.setState({
        teams: teams || [],
        teamsLoading: false,
      });
    } catch (e) {
      const error = parseErrors(e);

      this.setState({ teamsLoading: false });
      setFieldError(fieldNames.TEAM, error.error);
    }

    setSubmitting(false);
  };

  handleTeamChange = (
    selectedTeam,
    {
      setFieldValue,
      setFieldError,
      setSubmitting,
      values,
    },
  ) => {
    setFieldValue(fieldNames.TEAM, selectedTeam);

    this.loadAgents(
      selectedTeam,
      {
        setFieldValue,
        setFieldError,
        setSubmitting,
        values,
      },
    );
  };

  handleUpdate = async (repId, status) => {
    const {
      uuid,
      type,
      userType,
      notify,
      updateAcquisition,
    } = this.props;

    await updateAcquisition({
      variables: {
        uuid,
        ...(type === deskTypes.SALES
          ? { salesStatus: status }
          : { retentionStatus: status }),
        ...(repId && { parentOperator: repId }),
      },
    });

    notify({
      level: 'success',
      title: I18n.t('COMMON.SUCCESS'),
      message:
        userType === userTypes.LEAD_CUSTOMER
          ? I18n.t('LEADS.UPDATED')
          : I18n.t(`CLIENTS.${type}_INFO_UPDATED`),
    });
  };

  handleBulkUpdate = async (repId, status) => {
    const {
      uuids,
      type,
      userType,
      configs,
      bulkUpdateLeadsAcquisition,
      bulkUpdateClientsAcquisition,
      notify,
    } = this.props;

    const { allRowsSelected, selectedRowsLength, searchParams } = configs || {};

    const variables = {
      uuids,
      ...(repId && { parentOperators: repId }),
      ...(type === deskTypes.SALES
        ? { salesStatus: status }
        : { retentionStatus: status }),
      ...allRowsSelected && {
        searchParams,
        bulkSize: selectedRowsLength,
      },
    };

    if (userType === userTypes.LEAD_CUSTOMER) {
      await bulkUpdateLeadsAcquisition({ variables });
    } else {
      await bulkUpdateClientsAcquisition({ variables });
    }

    notify({
      level: 'success',
      title: I18n.t('COMMON.SUCCESS'),
      message:
        userType === userTypes.LEAD_CUSTOMER
          ? I18n.t('LEADS.BULK_UPDATED')
          : I18n.t(`CLIENTS.BULK_${type}_INFO_UPDATED`),
    });
  };

  handleUpdateRepresentative = async ({
    repId,
    status,
  }) => {
    const {
      uuid,
      onSuccess,
      onCloseModal,
      notify,
    } = this.props;

    try {
      if (uuid) {
        await this.handleUpdate(repId, status);
      } else {
        await this.handleBulkUpdate(repId, status);
      }
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.UPDATE_FAILED'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });

      return;
    }

    onCloseModal();
    onSuccess();

    EventEmitter.emit(ACQUISITION_STATUS_CHANGED);
  };

  render() {
    const {
      userBranchHierarchyQuery: {
        loading: deskLoading,
        data: userBranchHierarchyData,
      },
      hierarchyUsersByTypeQuery,
      hierarchyUsersByTypeQuery: { loading: initAgentsLoading },
      initialValues,
      onCloseModal,
      isOpen,
      type,
      header,
      configs: { multiAssign },
    } = this.props;

    const { agentsLoading, teamsLoading, agents, teams } = this.state;

    const desks = get(userBranchHierarchyData, 'userBranches.DESK') || [];
    const filteredDesks = desks.filter(({ deskType }) => deskType === deskTypes[type]);

    const users = getAgents(hierarchyUsersByTypeQuery, type) || [];

    const agentsDisabled = (
      agentsLoading || initAgentsLoading || (Array.isArray(agents) && agents.length === 0)
    );

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleUpdateRepresentative}
          validate={values => validate(values, { desks, users, type })}
          enableReinitialize
        >
          {({
            setFieldValue,
            setFieldError,
            setSubmitting,
            values,
            errors,
            isSubmitting,
            isValid,
            dirty,
          }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>{header}</ModalHeader>
              <ModalBody>
                <If condition={errors}>
                  {Object.values(errors).map(error => (
                    <div key={error} className="mb-2 text-center color-danger">
                      {error}
                    </div>
                  ))}
                </If>
                <Field
                  name={fieldNames.DESK}
                  label={I18n.t(attributeLabels(type).desk)}
                  placeholder={
                    !deskLoading && filteredDesks && filteredDesks.length === 0
                      ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                      : I18n.t('COMMON.SELECT_OPTION.ANY')
                  }
                  disabled={filteredDesks.length === 0}
                  component={FormikSelectField}
                  customOnChange={value => (
                    this.handleDeskChange(value, {
                      setFieldValue,
                      setFieldError,
                      setSubmitting,
                      values,
                    })
                  )}
                  withAnyOption
                  searchable
                >
                  {filteredDesks.map(({ name, uuid }) => (
                    <option key={uuid} value={uuid}>
                      {name}
                    </option>
                  ))}
                </Field>
                <Field
                  name={fieldNames.TEAM}
                  label={I18n.t(attributeLabels(type).team)}
                  placeholder={
                    values[fieldNames.DESK] && !teamsLoading
                    && teams.length === 0
                      ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                      : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
                  }
                  component={FormikSelectField}
                  disabled={
                    !values[fieldNames.DESK]
                    || teamsLoading
                    || teams.length === 0
                    || isSubmitting
                  }
                  customOnChange={value => (
                    this.handleTeamChange(value, {
                      setFieldValue,
                      setFieldError,
                      setSubmitting,
                      values,
                    })
                  )}
                  searchable
                >
                  {teams.map(({ name, uuid }) => (
                    <option key={uuid} value={uuid}>
                      {name}
                    </option>
                  ))}
                </Field>
                <Field
                  name={fieldNames.REPRESENTATIVE}
                  label={I18n.t(attributeLabels(type).representative)}
                  placeholder={!agentsLoading && !initAgentsLoading
                    && agents
                    && agents.length === 0
                    ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                    : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
                  }
                  component={FormikSelectField}
                  multiple={multiAssign}
                  customOnChange={value => setFieldValue(fieldNames.REPRESENTATIVE, value)}
                  disabled={agentsDisabled || isSubmitting}
                  searchable
                >
                  {(agents || []).map(({ fullName, uuid }) => (
                    <option key={uuid} value={uuid}>
                      {fullName}
                    </option>
                  ))}
                </Field>
                <Field
                  name={fieldNames.STATUS}
                  label={I18n.t(attributeLabels(type).status)}
                  component={FormikSelectField}
                  disabled={isSubmitting}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  searchable
                >
                  <Choose>
                    <When condition={type === deskTypes.SALES}>
                      {Object.values(salesStatusValues).map(value => (
                        <option key={value} value={value}>
                          {I18n.t(renderLabel(value, salesStatuses))}
                        </option>
                      ))}
                    </When>
                    <Otherwise>
                      {Object.values(retentionStatusValues).map(value => (
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
                  disabled={!dirty || !isValid || deskLoading || agentsDisabled || isSubmitting}
                  primary
                >
                  {I18n.t('CLIENTS.MODALS.SUBMIT')}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withApollo,
  withNotifications,
  withRequests({
    hierarchyUsersByTypeQuery: HierarchyUsersByTypeQuery,
    userBranchHierarchyQuery: UserBranchHierarchyQuery,
    updateAcquisition: UpdateAcquisition,
    bulkUpdateLeadsAcquisition: BulkUpdateLeadsAcquisition,
    bulkUpdateClientsAcquisition: BulkUpdateClientsAcquisition,
  }),
)(RepresentativeUpdateModal);
