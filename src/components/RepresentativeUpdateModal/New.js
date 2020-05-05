/* eslint-disable */
import React, { PureComponent } from 'react';
// import { Field, SubmissionError } from 'redux-form';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { compose } from 'react-apollo';
import { Formik, Field, Form } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'constants/propTypes';
import { deskTypes, userTypes } from 'constants/hierarchyTypes';
import { salesStatuses, salesStatusValues } from 'constants/salesStatuses';
import {
  retentionStatuses,
  retentionStatusValues,
} from 'constants/retentionStatuses';
import { Button } from 'components/UI';
import { FormikSelectField } from 'components/Formik';
// import { NasSelectField } from 'components/ReduxForm';
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

    handleSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    change: PropTypes.func.isRequired,
    error: PropTypes.any,
    type: PropTypes.string.isRequired,
    client: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
    initialValues: PropTypes.object,

    additionalFields: PropTypes.array,
    selectedDesk: PropTypes.string,
    selectedTeam: PropTypes.string,
    selectedRep: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    selectedAcquisition: PropTypes.string,
    currentStatus: PropTypes.string,
    configs: PropTypes.shape({
      multiAssign: PropTypes.bool,
      allRowsSelected: PropTypes.bool,
      totalElements: PropTypes.number,
      searchParams: PropTypes.object,
    }),
    currentInactiveOperator: PropTypes.string,
  };

  static defaultProps = {
    error: null,
    additionalFields: null,
    initialValues: null,
    selectedDesk: null,
    selectedTeam: null,
    selectedRep: null,
    selectedAcquisition: null,
    currentStatus: null,
    configs: {},
    currentInactiveOperator: null,
  };

  state = {
    agentsLoading: false,
    teamsLoading: false,
    agents: null,
    teams: [],
  };

  static getDerivedStateFromProps({ hierarchyUsers, type }, prevState) {
    const agents = getAgents(hierarchyUsers, type);

    if (agents && !prevState.agents) {
      return { agents };
    }

    return null;
  }

  handleDeskChange = async (selectedDesk) => {
    this.setState({ teamsLoading: true });
    const { selectedTeam, selectedRep, change, agents } = this.props;

    if (!selectedDesk) {
      this.setState({
        agents,
        teams: [],
      });
      change(fieldNames.REPRESENTATIVE, null);
      change(fieldNames.DESK, null);
      change(fieldNames.TEAM, null);

      return;
    }

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

    if (error) {
      this.setState({ teamsLoading: false });
      throw new SubmissionError({ _error: error.error });
    }

    change(fieldNames.DESK, selectedDesk);

    if (teams && teams.length === 1) {
      await this.handleTeamChange(teams[0].uuid);
    } else if (selectedTeam) {
      change(fieldNames.TEAM, null);
    } else if (teams && teams.length >= 2 && selectedRep) {
      change(fieldNames.REPRESENTATIVE, null);
    }

    this.setState({
      teams: teams || [],
      teamsLoading: false,
    });
  };

  handleTeamChange = async (selectedTeam) => {
    this.setState({ agentsLoading: true });
    const { selectedRep, client, change, type } = this.props;
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

    if (error) {
      this.setState({ agentsLoading: false });
      throw new SubmissionError({ _error: error.error });
    }

    const agents = filterAgents(data || [], type);
    change(fieldNames.TEAM, selectedTeam);

    if (agents && agents.length >= 1) {
      if (selectedRep) {
        let repIncludesAgents = false;
        agents.forEach((agent) => {
          if (selectedRep.includes(agent.uuid)) {
            repIncludesAgents = true;
          }
        });
        if (!repIncludesAgents) {
          this.handleRepChange(agents[0].uuid);
        }
      } else {
        this.handleRepChange(agents[0].uuid);
      }
    }

    this.setState({
      agents,
      agentsLoading: false,
    });
  };

  handleRepChange = (selectedOperator) => {
    const { change } = this.props;

    change(fieldNames.REPRESENTATIVE, selectedOperator);
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
      bulkRepresentativeUpdate,
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

      const { error: responseError } = await bulkRepresentativeUpdate({
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
      handleSubmit,
      onCloseModal,
      isOpen,
      invalid,
      pristine,
      submitting,
      error,
      type,
      userBranchHierarchy: { loading: deskLoading, hierarchy },
      hierarchyUsers: { loading: initAgentsLoading },
      header,
      additionalFields,
      initialValues,
      selectedDesk,
      selectedTeam,
      selectedRep,
      selectedAcquisition,
      currentStatus,
      configs: { multiAssign },
    } = this.props;

    const { agentsLoading, teamsLoading, agents, teams } = this.state;

    const desks = get(hierarchy, 'userBranchHierarchy.data.DESK') || [];
    const filteredDesks = desks.filter(
      ({ deskType }) => deskType === deskTypes[type]
    );

    const users = getAgents(hierarchyUsers, type) || [];

    const submitDisabled =
      agentsLoading ||
      deskLoading ||
      initAgentsLoading ||
      invalid ||
      (initialValues ? false : pristine) ||
      submitting ||
      (!currentStatus &&
        !selectedDesk &&
        !selectedTeam &&
        !selectedRep &&
        !selectedAcquisition);

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          onSubmit={handleSubmit(this.handleUpdateRepresentative)}
          validate={values => (
            createValidator(
              {
                deskId: [`in:,${desks.map(({ uuid }) => uuid).join()}`],
                repId: [`in:,${users.map(({ uuid }) => uuid).join()}`],
                teamId: ['string'],
                acquisitionStatus: ['string'],
                status: [
                  `in:,${[
                    ...Object.values(salesStatusValues),
                    ...Object.values(retentionStatusValues),
                  ].join()}`,
                ],
              },
              translateLabels(attributeLabels(type)),
              false
            )(values)
          )}
          enableReinitialize
        >
          {formikProps => (
            <Form>
              <ModalHeader toggle={onCloseModal}>{header}</ModalHeader>
              <ModalBody
                tag="form"
                onSubmit={handleSubmit(this.handleUpdateRepresentative)}
              >
                <If condition={error}>
                  <div className="mb-2 text-center color-danger">{error}</div>
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
                  customOnChange={value => this.handleDeskChange(value, values)}
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
                    selectedDesk && !teamsLoading && teams.length === 0
                      ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                      : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
                  }
                  component={FormikSelectField}
                  disabled={
                    !selectedDesk ||
                    teamsLoading ||
                    teams.length === 0 ||
                    submitting
                  }
                  customOnChange={this.handleTeamChange}
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
                  placeholder={
                    !agentsLoading &&
                    !initAgentsLoading &&
                    agents &&
                    agents.length === 0
                      ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                      : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
                  }
                  component={FormikSelectField}
                  multiple={multiAssign}
                  customOnChange={this.handleRepChange}
                  disabled={
                    agentsLoading ||
                    initAgentsLoading ||
                    submitting ||
                    (agents && agents.length === 0)
                  }
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
                  disabled={submitting}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                >
                  <Choose>
                    <When condition={type === deskTypes.SALES}>
                      {Object.entries(salesStatusValues).map(([, value]) => (
                        <option key={value} value={value}>
                          {I18n.t(renderLabel(value, salesStatuses))}
                        </option>
                      ))}
                    </When>
                    <Otherwise>
                      {Object.entries(retentionStatusValues).map(
                        ([, value]) => (
                          <option key={value} value={value}>
                            {I18n.t(renderLabel(value, retentionStatuses))}
                          </option>
                        )
                      )}
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
                          disabled={disabled || submitting}
                          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                        >
                          {data.map(({ value, label }) => (
                            <option key={value} value={value}>
                              {I18n.t(label)}
                            </option>
                          ))}
                        </Field>
                      </If>
                    )
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
                  disabled={
                    submitDisabled ||
                    (Array.isArray(agents) && agents.length === 0)
                  }
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
    clientBulkRepresUpdate: ClientBulkRepresUpdate,
    LeadBulkRepresUpdate: LeadBulkRepresUpdate,
  }),
)(RepresentativeUpdateModal);
