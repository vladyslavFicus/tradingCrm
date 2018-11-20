import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../constants/propTypes';
import { deskTypes } from '../../constants/hierarchyTypes';
import { salesStatuses, salesStatusValues } from '../../constants/salesStatuses';
import { retentionStatuses, retentionStatusValues } from '../../constants/retentionStatuses';
import { NasSelectField } from '../../components/ReduxForm';
import {
  getUsersByBranch,
  getUserBranchHierarchy,
  getBranchChildren,
} from '../../graphql/queries/hierarchy';
import Select from '../../components/Select';
import renderLabel from '../../utils/renderLabel';
import { attributeLabels, components, getAgents, filterAgents } from './constants';

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
  };

  static defaultProps = {
    error: null,
    additionalFields: null,
  };

  state = {
    selectedDesk: '',
    selectedRep: '',
    selectedTeam: '',
    agentsLoading: false,
    teamsLoading: false,
    desks: [],
    agents: [],
    teams: [],
  };

  static getDerivedStateFromProps({ userBranchHierarchy, hierarchyUsers, type }, prevState) {
    let newState = null;
    const { DESK: desks } = get(userBranchHierarchy, 'hierarchy.userBranchHierarchy.data') || { DESK: null };
    const agents = getAgents(hierarchyUsers, type);

    // INFO: initial set desks and agents
    if (Array.isArray(desks) && prevState.desks.length === 0) {
      newState = {
        desks: desks.filter(({ deskType }) => deskType === deskTypes[type]),
      };
    }

    if (agents && prevState.agents.length === 0) {
      newState = { ...newState, agents };
    }

    return newState;
  }

  handleDeskChange = async (selectedDesk) => {
    this.setState({
      teamsLoading: true,
    });
    const { selectedTeam, selectedRep } = this.state;

    const { data: { hierarchy: { branchChildren: { data: teams, error } } } } = await this.props.client.query({
      query: getBranchChildren,
      variables: { uuid: selectedDesk },
    });

    if (error) {
      throw new SubmissionError({ _error: error.error });
    }

    this.setState({
      teams: teams || [],
      selectedDesk,
      teamsLoading: false,
      ...(selectedTeam && { selectedTeam: '' }),
      ...(selectedRep && { selectedRep: '' }),
    }, () => {
      this.props.change('deskId', selectedDesk);

      if (selectedTeam) {
        this.props.change('teamId', null);
      } else if (teams && teams.length === 1) {
        this.props.change('teamId', teams[0].uuid);
      }

      if (selectedRep) {
        this.props.change('repId', null);
      }
    });
  }

  handleTeamChange = async (selectedTeam) => {
    this.setState({
      agentsLoading: true,
    });
    const { client, type } = this.props;
    const { selectedRep } = this.state;

    const { data: { hierarchy: { usersByBranch: { data, error } } } } = await client.query({
      query: getUsersByBranch,
      variables: {
        uuid: selectedTeam,
      },
    });
    const agents = filterAgents(data || [], type);

    if (error) {
      throw new SubmissionError({ _error: error.error });
    }

    this.setState({
      agents,
      selectedTeam,
      agentsLoading: false,
    }, () => {
      this.props.change('teamId', selectedTeam);

      if (selectedRep) {
        this.props.change('repId', null);
      }

      if (agents && agents.length === 1) {
        this.props.change('repId', agents[0].uuid);
      }
    });
  }

  handleRepChange = async (selectedRep) => {
    this.setState({
      teamsLoading: true,
    });

    const { selectedTeam } = this.state;
    const { client } = this.props;
    let teams = null;

    if (!selectedTeam) {
      const { data: { hierarchy: { userBranchHierarchy: { data: { TEAM }, error } } } } = await client.query({
        query: getUserBranchHierarchy,
        variables: { userId: selectedRep },
      });

      if (error) {
        throw new SubmissionError({ _error: error.error });
      }
      teams = TEAM || null;
    }

    this.setState({
      selectedRep,
      teamsLoading: false,
      ...(!selectedTeam && teams && {
        teams,
        ...(teams.length === 1 && { selectedTeam: teams[0].uuid }),
      }),
    }, () => {
      this.props.change('repId', selectedRep);

      if (teams && teams.length === 1) {
        this.props.change('teamId', teams[0].uuid);
      }
    });
  }

  handleUpdateRepresentative = async ({ teamId, repId, status, aquisitionStatus }) => {
    const {
      notify,
      onSuccess,
      ids,
      type,
      bulkRepresentativeUpdate,
      props,
      onCloseModal,
    } = this.props;

    const { allRowsSelected, totalElements, searchParams } = props || {};

    const { data: { clients: { bulkRepresentativeUpdate: { error } } } } = await bulkRepresentativeUpdate({
      variables: {
        ids,
        teamId,
        type,
        allRowsSelected,
        totalElements,
        aquisitionStatus,
        searchParams,
        ...(type === deskTypes.SALES
          ? { salesStatus: status, salesRep: repId }
          : { retentionStatus: status, retentionRep: repId }),
      },
    });

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
        message: type === deskTypes.SALES
          ? I18n.t('CLIENTS.SALES_INFO_UPDATED')
          : I18n.t('CLIENTS.RETENTION_INFO_UPDATED'),
      });
      onCloseModal();
      onSuccess();
    }
  }

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
      userBranchHierarchy: { loading: deskLoading },
      hierarchyUsers: { loading: initAgentsLoading },
      header,
      additionalFields,
    } = this.props;

    const {
      selectedDesk,
      selectedRep,
      selectedTeam,
      agentsLoading,
      teamsLoading,
      desks,
      agents,
      teams,
    } = this.state;

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
          <span className="font-weight-600">{I18n.t(attributeLabels(type).desk)}</span>
          <Select
            value={selectedDesk}
            customClassName="form-group"
            placeholder={!deskLoading && desks.length === 0
              ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
              : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
            }
            disabled={deskLoading || desks.length === 0 || submitting}
            onChange={this.handleDeskChange}
          >
            {desks.map(({ name, uuid }) => (
              <option key={uuid} value={uuid}>
                {name}
              </option>
            ))}
          </Select>
          <span className="font-weight-600">{I18n.t(attributeLabels(type).team)}</span>
          <Select
            value={selectedTeam}
            customClassName="form-group"
            placeholder={selectedDesk && !teamsLoading && teams.length === 0
              ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
              : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
            }
            disabled={!selectedDesk || teamsLoading || teams.length === 0 || submitting}
            onChange={this.handleTeamChange}
          >
            {teams.map(({ name, uuid }) => (
              <option key={uuid} value={uuid}>
                {name}
              </option>
            ))}
          </Select>
          <span className="font-weight-600">{I18n.t(attributeLabels(type).representative)}</span>
          <Select
            value={selectedRep}
            customClassName="form-group"
            placeholder={!agentsLoading && !initAgentsLoading && agents.length === 0
              ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
              : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
            }
            disabled={agentsLoading || initAgentsLoading || agents.length === 0 || submitting}
            onChange={this.handleRepChange}
          >
            {agents.map(({ fullName, uuid }) => (
              <option key={uuid} value={uuid}>
                {fullName}
              </option>
            ))}
          </Select>
          <Field
            name="status"
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
            {additionalFields.map(({ name, labelName, component, data }) => {
              if (component === components[component]) {
                return (
                  <Field
                    name={name}
                    key={name}
                    label={I18n.t(attributeLabels(type)[labelName])}
                    component={NasSelectField}
                    disabled={submitting}
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
            disabled={agentsLoading || deskLoading || initAgentsLoading || invalid || pristine || submitting}
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
