import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { isEqual } from 'lodash';
import PropTypes from '../../../../../../../constants/propTypes';
import { deskTypes } from '../../../../../../../constants/hierarchyTypes';
import { salesStatuses, salesStatusValues } from '../../../../../../../constants/salesStatuses';
import { retentionStatuses, retentionStatusValues } from '../../../../../../../constants/retentionStatuses';
import { NasSelectField } from '../../../../../../../components/ReduxForm';
import {
  getUsersByBranch,
  getUserBranchHierarchy,
  getBranchChildren,
} from '../../../../../../../graphql/queries/hierarchy';
import Select from '../../../../../../../components/Select';
import renderLabel from '../../../../../../../utils/renderLabel';
import attributeLabels from './constants';

class RepresentativeModal extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    error: PropTypes.any,
    i18nPrefix: PropTypes.string.isRequired,
    clientsSelected: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    agents: PropTypes.arrayOf(PropTypes.userHierarchyType).isRequired,
    desks: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
    client: PropTypes.object.isRequired,
  };

  static defaultProps = {
    error: null,
  };

  state = {
    selectedDesk: '',
    selectedRep: '',
    selectedTeam: '',
    agentsLoading: false,
    deskLoading: false,
    teamsLoading: false,
    desks: this.props.desks,
    agents: this.props.agents,
    teams: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.desks, prevState.desks)) {
      return {
        agents: nextProps.agents,
        desks: nextProps.desks,
        teams: [],
      };
    }

    return null;
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
    const { client } = this.props;
    const { selectedRep } = this.state;

    const { data: { hierarchy: { usersByBranch: { data, error } } } } = await client.query({
      query: getUsersByBranch,
      variables: {
        uuid: selectedTeam,
      },
    });

    if (error) {
      throw new SubmissionError({ _error: error.error });
    }

    this.setState({
      agents: data || [],
      selectedTeam,
      agentsLoading: false,
    }, () => {
      this.props.change('teamId', selectedTeam);

      if (selectedRep) {
        this.props.change('repId', null);
      }

      if (data && data.length === 1) {
        this.props.change('repId', data[0].uuid);
      }
    });
  }

  handleRepChange = async (selectedRep) => {
    this.setState({
      teamsLoading: true,
    });
    const { selectedTeam } = this.state;

    const { data: { hierarchy: { userBranchHierarchy: { data: { TEAM }, error } } } } = await this.props.client.query({
      query: getUserBranchHierarchy,
      variables: { userId: selectedRep },
    });

    const teams = TEAM || null;

    if (error) {
      throw new SubmissionError({ _error: error.error });
    }

    this.setState({
      selectedRep,
      teamsLoading: false,
      ...(!selectedTeam && teams && teams.length === 1 && { selectedTeam: teams[0].uuid }),
    }, () => {
      this.props.change('repId', selectedRep);

      if (teams && teams.length === 1) {
        this.props.change('teamId', teams[0].uuid);
      }
    });
  }

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      invalid,
      pristine,
      submitting,
      onSubmit,
      error,
      i18nPrefix,
      clientsSelected,
      type,
    } = this.props;

    const {
      selectedDesk,
      selectedRep,
      selectedTeam,
      agentsLoading,
      deskLoading,
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
          <div>{I18n.t(`CLIENTS.MODALS.${i18nPrefix}.HEADER`)}</div>
          <div className="font-size-11 color-yellow">{clientsSelected}{' '}{I18n.t('COMMON.CLIENTS_SELECTED')}</div>
        </ModalHeader>
        <ModalBody
          tag="form"
          id="representative-modal-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <If condition={error}>
            <div className="mb-2 text-center color-danger">
              {error}
            </div>
          </If>
          <span className="font-weight-600">{I18n.t(attributeLabels(i18nPrefix).desk)}</span>
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
          <span className="font-weight-600">{I18n.t(attributeLabels(i18nPrefix).team)}</span>
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
          <span className="font-weight-600">{I18n.t(attributeLabels(i18nPrefix).representative)}</span>
          <Select
            value={selectedRep}
            customClassName="form-group"
            placeholder={!agentsLoading && agents.length === 0
              ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
              : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
            }
            disabled={agentsLoading || agents.length === 0 || submitting}
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
            label={I18n.t(attributeLabels(i18nPrefix).status)}
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
            disabled={agentsLoading || deskLoading || invalid || pristine || submitting}
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

export default RepresentativeModal;
