import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withApollo, compose } from 'react-apollo';
import { Formik, Field, Form } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withNotifications } from 'hoc';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { deskTypes, userTypes } from 'constants/hierarchyTypes';
import { salesStatuses, salesStatusValues } from 'constants/salesStatuses';
import {
  retentionStatuses,
  retentionStatusValues,
} from 'constants/retentionStatuses';
import { Button } from 'components/UI';
import { FormikSelectField } from 'components/Formik';
import { getUsersByBranch, getBranchChildren } from 'graphql/queries/hierarchy';
import renderLabel from 'utils/renderLabel';
import {
  attributeLabels,
  components,
  getAgents,
  filterAgents,
  fieldNames,
} from './constants';
import {
  HierarchyUsersByTypeQuery,
  UserBranchHierarchyQuery,
  ClientBulkRepresUpdate,
  LeadBulkRepresUpdate,
} from './graphql';

class RepresentativeUpdateModal extends PureComponent {
  static propTypes = {
    hierarchyUsersByTypeQuery: PropTypes.query({
      hierarchy: PropTypes.shape({
        hierarchyUsersByType: PropTypes.response({
          SALES_AGENT: PropTypes.arrayOf(PropTypes.userHierarchyType),
          RETENTION_AGENT: PropTypes.arrayOf(PropTypes.userHierarchyType),
        }),
      }),
    }).isRequired,
    userBranchHierarchyQuery: PropTypes.query({
      hierarchy: PropTypes.shape({
        userBranchHierarchy: PropTypes.response({
          DESK: PropTypes.arrayOf(PropTypes.branchHierarchyType),
          TEAM: PropTypes.arrayOf(PropTypes.branchHierarchyType),
        }),
      }),
    }).isRequired,
    header: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
    type: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
    initialValues: PropTypes.object,
    additionalFields: PropTypes.array,
    configs: PropTypes.shape({
      multiAssign: PropTypes.bool,
      allRowsSelected: PropTypes.bool,
      totalElements: PropTypes.number,
      searchParams: PropTypes.object,
    }),
    currentInactiveOperator: PropTypes.string,
    leads: PropTypes.array,
    clients: PropTypes.array.isRequired,
    notify: PropTypes.func.isRequired,
    bulkClientRepresentativeUpdate: PropTypes.func.isRequired,
    bulkLeadRepresentativeUpdate: PropTypes.func.isRequired,
    userType: PropTypes.string,
  };

  static defaultProps = {
    initialValues: {},
    additionalFields: null,
    configs: {},
    currentInactiveOperator: null,
    leads: null,
    userType: null,
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

  handleDeskChange = async (selectedDesk, formikAPI) => {
    const { setFieldValue, setFieldError, setSubmitting, values } = formikAPI;

    this.setState({ teamsLoading: true });

    if (!selectedDesk) {
      this.setState({
        teams: [],
      });

      setFieldValue(fieldNames.REPRESENTATIVE, null);
      setFieldValue(fieldNames.DESK, null);
      setFieldValue(fieldNames.TEAM, null);

      return;
    }

    setSubmitting(true);

    const {
      data: {
        hierarchy: {
          branchChildren: { data: teams, error },
        },
      },
    } = await this.props.client.query({
      query: getBranchChildren,
      variables: { uuid: selectedDesk },
    });

    setSubmitting(false);

    if (error) {
      this.setState({ teamsLoading: false });
      setFieldError(fieldNames.TEAM, error.error);
      return;
    }

    setFieldValue(fieldNames.DESK, selectedDesk);

    if (teams && teams.length === 1) {
      await this.handleTeamChange(teams[0].uuid, formikAPI);
    } else if (values[fieldNames.TEAM]) {
      setFieldValue(fieldNames.TEAM, null);
    } else if (teams && teams.length >= 2
      && values[fieldNames.REPRESENTATIVE]
    ) {
      setFieldValue(fieldNames.REPRESENTATIVE, null);
    }

    this.setState({
      teams: teams || [],
      teamsLoading: false,
    });
  };

  handleTeamChange = async (selectedTeam, formikAPI) => {
    const { client, type } = this.props;
    const { setFieldValue, setFieldError, setSubmitting, values } = formikAPI;

    this.setState({ agentsLoading: true });

    setSubmitting(true);

    const {
      data: {
        hierarchy: {
          usersByBranch: { data, error },
        },
      },
    } = await client.query({
      query: getUsersByBranch,
      variables: {
        onlyActive: true,
        uuids: [selectedTeam],
      },
    });

    setSubmitting(false);

    if (error) {
      this.setState({ agentsLoading: false });
      setFieldError(fieldNames.REPRESENTATIVE, error.error);
      return;
    }

    const agents = filterAgents(data || [], type);

    setFieldValue(fieldNames.TEAM, selectedTeam);

    if (agents && agents.length >= 1) {
      if (values[fieldNames.REPRESENTATIVE]) {
        let repIncludesAgents = false;
        agents.forEach((agent) => {
          if (values[fieldNames.REPRESENTATIVE].includes(agent.uuid)) {
            repIncludesAgents = true;
          }
        });
        if (!repIncludesAgents) {
          this.handleRepChange(agents[0].uuid, formikAPI);
        }
      } else {
        this.handleRepChange(agents[0].uuid, formikAPI);
      }
    }

    this.setState({
      agents,
      agentsLoading: false,
    });
  };

  handleRepChange = (selectedOperator, formikAPI) => {
    const { setFieldValue } = formikAPI;

    setFieldValue(fieldNames.REPRESENTATIVE, selectedOperator);
  };

  handleUpdateRepresentative = async ({
    teamId,
    repId,
    status,
    acquisitionStatus,
  }) => {
    const {
      leads,
      type,
      configs,
      notify,
      userType,
      onSuccess,
      onCloseModal,
      bulkClientRepresentativeUpdate,
      bulkLeadRepresentativeUpdate,
    } = this.props;

    let representative = null;
    const { allRowsSelected, totalElements, searchParams } = configs || {};

    if (repId) {
      representative = Array.isArray(repId) ? repId : [repId];
    }

    const variables = {
      teamId,
      type,
      allRowsSelected,
      totalElements,
      searchParams,
      ...(type === deskTypes.SALES
        ? { salesStatus: status, salesRepresentative: representative }
        : { retentionStatus: status, retentionRepresentative: representative }),
    };

    let error = null;

    if (userType === userTypes.LEAD_CUSTOMER) {
      const { error: responseError } = await bulkLeadRepresentativeUpdate({
        variables: { ...variables, leads },
      });

      error = responseError;
    } else {
      const { clients, currentInactiveOperator } = this.props;

      /* INFO
       * when move performed on client profile and rep selected
       * manually pass salesRepresentative or retentionRepresentative
       * and add move flag
       */
      if (acquisitionStatus) {
        clients[0] = {
          ...clients[0],
          [`${acquisitionStatus.toLowerCase()}Representative`]: currentInactiveOperator,
        };
        variables.isMoveAction = true;
      }

      const { error: responseError } = await bulkClientRepresentativeUpdate({
        variables: { ...variables, clients },
      });

      error = responseError;
    }

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    } else {
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message:
          userType === userTypes.LEAD_CUSTOMER
            ? I18n.t(`LEADS.${type}_INFO_UPDATED`)
            : I18n.t(`CLIENTS.${type}_INFO_UPDATED`),
      });

      onCloseModal();
      onSuccess();
    }
  };

  render() {
    const {
      userBranchHierarchyQuery: {
        loading: deskLoading,
        data: userBranchHierarchyData,
      },
      hierarchyUsersByTypeQuery: { loading: initAgentsLoading },
      initialValues,
      onCloseModal,
      isOpen,
      type,
      header,
      additionalFields,
      configs: { multiAssign },
    } = this.props;

    const { agentsLoading, teamsLoading, agents, teams } = this.state;

    const desks = get(userBranchHierarchyData, 'hierarchy.userBranchHierarchy.data.DESK') || [];
    const filteredDesks = desks.filter(({ deskType }) => deskType === deskTypes[type]);

    const agentsDisabled = (
      agentsLoading || initAgentsLoading || (Array.isArray(agents) && agents.length === 0)
    );

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleUpdateRepresentative}
          enableReinitialize
        >
          {formikAPI => (
            <Form>
              <ModalHeader toggle={onCloseModal}>{header}</ModalHeader>
              <ModalBody>
                <If condition={Object.values(formikAPI.errors).length}>
                  {Object.values(formikAPI.errors).map(error => (
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
                  customOnChange={value => this.handleDeskChange(value, formikAPI)}
                  withAnyOption
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
                    formikAPI.values[fieldNames.DESK] && !teamsLoading
                    && teams.length === 0
                      ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                      : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
                  }
                  component={FormikSelectField}
                  disabled={
                    !formikAPI.values[fieldNames.DESK]
                    || teamsLoading
                    || teams.length === 0
                    || formikAPI.isSubmitting
                  }
                  customOnChange={value => this.handleTeamChange(value, formikAPI)}
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
                  customOnChange={value => this.handleRepChange(value, formikAPI)}
                  disabled={agentsDisabled || formikAPI.isSubmitting}
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
                  disabled={formikAPI.isSubmitting}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
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
                <If condition={Array.isArray(additionalFields)}>
                  {additionalFields.map(
                    ({ name, disabled, labelName, component, data }) => (
                      <If condition={component === components[component]}>
                        <Field
                          key={name}
                          name={name}
                          label={I18n.t(attributeLabels(type)[labelName])}
                          component={FormikSelectField}
                          disabled={disabled || formikAPI.isSubmitting}
                          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                        >
                          {data.map(({ value, label }) => (
                            <option key={value} value={value}>
                              {I18n.t(label)}
                            </option>
                          ))}
                        </Field>
                      </If>
                    ),
                  )}
                </If>
              </ModalBody>
              <ModalFooter>
                <Button className="btn" onClick={onCloseModal} commonOutline>
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  className="btn"
                  type="submit"
                  disabled={!formikAPI.isValid || deskLoading || agentsDisabled}
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
  withStorage(['auth']),
  withRequests({
    hierarchyUsersByTypeQuery: HierarchyUsersByTypeQuery,
    userBranchHierarchyQuery: UserBranchHierarchyQuery,
    bulkClientRepresentativeUpdate: ClientBulkRepresUpdate,
    bulkLeadRepresentativeUpdate: LeadBulkRepresUpdate,
  }),
)(RepresentativeUpdateModal);
