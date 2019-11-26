import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { actionCreators as windowActionCreators } from 'redux/modules/window';
import PropTypes from 'constants/propTypes';
import { deskTypes, userTypes } from 'constants/hierarchyTypes';
import { salesStatuses, salesStatusValues } from 'constants/salesStatuses';
import { retentionStatuses, retentionStatusValues } from 'constants/retentionStatuses';
import { NasSelectField } from 'components/ReduxForm';
import {
  getUsersByBranch,
  getBranchChildren,
} from 'graphql/queries/hierarchy';
import renderLabel from 'utils/renderLabel';
import { attributeLabels, components, getAgents, filterAgents, fieldNames } from './constants';

class RepresentativeUpdateModal extends Component {
  static propTypes = {
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
    userBranchHierarchy: PropTypes.shape({
      hierarchy: PropTypes.shape({
        userBranchHierarchy: PropTypes.shape({
          data: PropTypes.shape({
            DESK: PropTypes.arrayOf(PropTypes.branchHierarchyType),
            TEAM: PropTypes.arrayOf(PropTypes.branchHierarchyType),
          }),
          error: PropTypes.object,
        }),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    hierarchyUsers: PropTypes.shape({
      hierarchy: PropTypes.shape({
        hierarchyUsersByType: PropTypes.shape({
          data: PropTypes.shape({
            SALES_AGENT: PropTypes.arrayOf(PropTypes.userHierarchyType),
            RETENTION_AGENT: PropTypes.arrayOf(PropTypes.userHierarchyType),
          }),
          error: PropTypes.object,
        }),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    header: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
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
    const {
      selectedTeam,
      selectedRep,
      change,
      agents,
    } = this.props;

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

    const { data: { hierarchy: { branchChildren: { data: teams, error } } } } = await this.props.client.query({
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
    }

    if (selectedRep) {
      change(fieldNames.REPRESENTATIVE, null);
    }

    this.setState({
      teams: teams || [],
      teamsLoading: false,
    });
  };

  handleTeamChange = async (selectedTeam) => {
    this.setState({ agentsLoading: true });
    const {
      selectedRep,
      client,
      change,
      type,
    } = this.props;

    const { data: { hierarchy: { usersByBranch: { data, error } } } } = await client.query({
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

    if (agents && agents.length === 1) {
      change(fieldNames.REPRESENTATIVE, [agents[0].uuid]);
    } else if (selectedRep) {
      change(fieldNames.REPRESENTATIVE, null);
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

  handleUpdateRepresentative = async ({ teamId, repId, status, aquisitionStatus }) => {
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
        ? { salesStatus: status, salesRep: representative }
        : { retentionStatus: status, retentionRep: representative }),
    };

    let error = null;

    if (userType === userTypes.LEAD_CUSTOMER) {
      const response = await bulkLeadRepresentativeUpdate({
        variables: { ...variables, leads },
      });

      ({ error } = response.data.leads.bulkLeadUpdate);
    } else {
      const {
        clients,
        currentInactiveOperator,
      } = this.props;

      /* INFO
      * when move performed on client profile and rep selected
      * manually pass assignToOperator and add move flag
      */
      if (aquisitionStatus) {
        clients[0] = { ...clients[0], assignToOperator: currentInactiveOperator };
        variables.isMoveAction = true;
      }

      // When chosen repId and it was on client profile page --> we set repId as assignToOperator field
      if (repId && !Array.isArray(repId)) {
        clients[0] = { ...clients[0], assignToOperator: repId };
      }

      const response = await bulkRepresentativeUpdate({
        variables: { ...variables, clients },
      });

      ({ error } = response.data.clients.bulkRepresentativeUpdate);
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
        message: userType === userTypes.LEAD_CUSTOMER
          ? I18n.t(`LEADS.${type}_INFO_UPDATED`)
          : I18n.t(`CLIENTS.${type}_INFO_UPDATED`),
      });

      onCloseModal();
      onSuccess();

      if (window.isFrame) {
        window.dispatchAction(windowActionCreators.updateClientList());
      }
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

    const {
      agentsLoading,
      teamsLoading,
      agents,
      teams,
    } = this.state;

    const desks = get(hierarchy, 'userBranchHierarchy.data.DESK') || [];
    const filteredDesks = desks.filter(({ deskType }) => deskType === deskTypes[type]);

    const submitDisabled = (
      agentsLoading
      || deskLoading
      || initAgentsLoading
      || invalid
      || (initialValues ? false : pristine)
      || submitting
      || (!currentStatus && !selectedDesk && !selectedTeam && !selectedRep && !selectedAcquisition)
    );

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <ModalHeader toggle={onCloseModal}>
          {header}
        </ModalHeader>
        <ModalBody
          tag="form"
          id="representative-modal-form"
          onSubmit={handleSubmit(this.handleUpdateRepresentative)}
        >
          <If condition={error}>
            <div className="mb-2 text-center color-danger">
              {error}
            </div>
          </If>
          <Field
            name={fieldNames.DESK}
            label={I18n.t(attributeLabels(type).desk)}
            placeholder={!deskLoading && filteredDesks && filteredDesks.length === 0
              ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
              : I18n.t('COMMON.SELECT_OPTION.ANY')
            }
            disabled={filteredDesks.length === 0}
            component={NasSelectField}
            onFieldChange={this.handleDeskChange}
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
            placeholder={selectedDesk && !teamsLoading && teams.length === 0
              ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
              : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
            }
            component={NasSelectField}
            disabled={!selectedDesk || teamsLoading || teams.length === 0 || submitting}
            onFieldChange={this.handleTeamChange}
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
            placeholder={!agentsLoading && !initAgentsLoading && agents && agents.length === 0
              ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
              : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
            }
            component={NasSelectField}
            multiple={multiAssign}
            onFieldChange={this.handleRepChange}
            disabled={agentsLoading || initAgentsLoading || submitting || (agents && agents.length === 0)
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
            component={NasSelectField}
            disabled={submitting}
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          >
            <Choose>
              <When condition={type === deskTypes.SALES}>
                {Object.entries(salesStatusValues).map(([, value]) => (
                  <option key={value} value={value}>
                    {renderLabel(value, salesStatuses)}
                  </option>
                ))}
              </When>
              <Otherwise>
                {Object.entries(retentionStatusValues).map(([, value]) => (
                  <option key={value} value={value}>
                    {renderLabel(value, retentionStatuses)}
                  </option>
                ))}
              </Otherwise>
            </Choose>
          </Field>
          <If condition={Array.isArray(additionalFields)}>
            {additionalFields.map(({ name, disabled, labelName, component, data }) => {
              if (component === components[component]) {
                return (
                  <Field
                    name={name}
                    key={name}
                    label={I18n.t(attributeLabels(type)[labelName])}
                    component={NasSelectField}
                    disabled={disabled || submitting}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  >
                    {data.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {I18n.t(label)}
                      </option>
                    ))}
                  </Field>
                );
              }

              return null;
            })}
          </If>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-default-outline"
            onClick={onCloseModal}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button
            type="submit"
            disabled={submitDisabled}
            className="btn btn-primary"
            form="representative-modal-form"
          >
            {I18n.t('CLIENTS.MODALS.SUBMIT')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default RepresentativeUpdateModal;
