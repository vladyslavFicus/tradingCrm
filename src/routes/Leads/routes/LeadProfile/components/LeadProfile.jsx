import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { SubmissionError } from 'redux-form';
import { Switch, Redirect } from 'react-router-dom';
import NotePopover from 'components/NotePopover';
import { viewType as noteViewType } from 'constants/note';
import { getActiveBrandConfig } from 'config';
import Tabs from 'components/Tabs';
import NotFound from 'routes/NotFound';
import PropTypes from 'constants/propTypes';
import HideDetails from 'components/HideDetails';
import { aquisitionStatusesNames } from 'constants/aquisitionStatuses';
import { userTypes } from 'constants/hierarchyTypes';
import { leadProfileTabs } from '../../../constants';
import { Route } from '../../../../../router';
import Profile from '../routes/Profile';
import Notes from '../routes/Notes';
import Information from './Information';
import Header from './Header';

const NOTE_POPOVER = 'note-popover';
const popoverInitialState = {
  name: null,
  params: {},
};

class LeadProfile extends Component {
  static propTypes = {
    leadProfile: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      leadProfile: PropTypes.shape({
        data: PropTypes.lead,
        error: PropTypes.object,
      }),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    pinnedNotes: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      notes: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.shape({
          author: PropTypes.string,
          lastEditorUUID: PropTypes.string,
          targetUUID: PropTypes.string,
        })),
      }),
    }).isRequired,
    promoteLead: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      promoteLeadModal: PropTypes.modalType,
    }).isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  };

  static childContextTypes = {
    onEditModalNoteClick: PropTypes.func.isRequired,
    triggerRepresentativeUpdateModal: PropTypes.func.isRequired,
  };

  state = {
    popover: { ...popoverInitialState },
  };

  getChildContext() {
    return {
      onEditModalNoteClick: this.handleEditModalNoteClick,
      triggerRepresentativeUpdateModal: this.triggerRepresentativeUpdateModal,
    };
  }

  handlePromoteLead = async (values) => {
    const {
      notify,
      promoteLead,
      leadProfile: {
        refetch,
        leadProfile: {
          data: {
            phone,
            city,
            brandId,
            id,
          },
        },
      },
      modals: {
        promoteLeadModal,
      },
    } = this.props;

    const { data: { leads: { promote: { data, error } } } } = await promoteLead({
      variables: {
        ...values,
        phone,
        city,
        brandId,
        leadUuid: id,
      },
    });

    if (error) {
      if (!error.fields_errors) {
        throw new SubmissionError({ _error: error.error });
      }

      const formError = Object
        .entries(error.fields_errors)
        .map(([key, { error: err }]) => `${key}: ${err}`);

      throw new SubmissionError({ _error: formError.join(', ') });
    } else {
      await refetch();
      promoteLeadModal.hide();
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('LEADS.SUCCESS_PROMOTED', { id: data.playerUUID }),
      });
    }
  };

  triggerRepresentativeUpdateModal = () => {
    const {
      modals: { representativeModal },
      leadProfile: { refetch, leadProfile: { data } },
      match: { params: { id } },
    } = this.props;

    const unassignFromOperator = get(data, 'salesAgent.uuid') || null;

    representativeModal.show({
      type: aquisitionStatusesNames.SALES,
      userType: userTypes.LEAD_CUSTOMER,
      leads: [{
        uuid: id,
        ...(unassignFromOperator && { unassignFromOperator }),
      }],
      initialValues: { aquisitionStatus: aquisitionStatusesNames.SALES },
      header: I18n.t(
        'LEAD_PROFILE.MODALS.REPRESENTATIVE_UPDATE.HEADER',
        { type: aquisitionStatusesNames.SALES.toLowerCase() }
      ),
      onSuccess: () => refetch(),
    });
  };

  triggerLeadModal = () => {
    const {
      leadProfile: {
        leadProfile: {
          data: {
            name,
            surname,
            email,
            country,
            language,
            phone,
            gender,
            birthDate,
            mobile,
          },
        },
      },
      modals: { promoteLeadModal },
    } = this.props;

    const brandConfig = getActiveBrandConfig();

    promoteLeadModal.show({
      onSubmit: values => this.handlePromoteLead(values),
      supportedCurrencies: get(brandConfig, 'currencies.supported') || [],
      initialValues: {
        firstName: name,
        lastName: surname,
        email,
        country,
        currency: get(brandConfig, 'currencies.base'),
        phone,
        phone2: mobile,
        gender,
        birthDate,
        languageCode: language,
      },
    });
  };

  handleEditModalNoteClick = (type, item) => () => {
    const { modals: { noteModal } } = this.props;

    noteModal.show({
      type,
      onEdit: data => this.handleSubmitNoteClick(noteViewType.MODAL, data),
      onDelete: () => this.handleDeleteNoteClick(noteViewType.MODAL, item.noteId),
      tagType: item.tagType,
      initialValues: {
        ...item,
      },
    });
  };

  handleNoteHide = (type) => {
    const { modals: { noteModal } } = this.props;

    if (type === noteViewType.POPOVER) {
      this.setState({ popover: { name: null, params: {} } });
    } else {
      noteModal.hide();
    }
  };

  handleAddNoteClick = (target, params = {}) => {
    const {
      match: { params: { id: leadUUID } },
    } = this.props;

    this.setState({
      popover: {
        name: NOTE_POPOVER,
        params: {
          placement: 'bottom',
          ...params,
          target,
          initialValues: {
            targetUUID: leadUUID,
            playerUUID: `PLAYER-${leadUUID}`,
            pinned: false,
          },
        },
      },
    });
  };

  handleEditNoteClick = (target, item, params = {}) => {
    this.setState({
      popover: {
        name: NOTE_POPOVER,
        params: {
          ...params,
          item,
          target,
          initialValues: { ...item },
        },
      },
    });
  };

  handleSubmitNoteClick = async (viewType, data) => {
    const {
      updateNote,
      addNote,
      match: { params: { id: leadUUID } },
    } = this.props;

    if (data.noteId) {
      const updatedNote = await updateNote({ variables: data });

      this.handleNoteHide(viewType);

      return updatedNote;
    }

    const response = await addNote({
      variables: {
        ...data,
        playerUUID: `PLAYER-${leadUUID}`,
      },
    });

    this.handleNoteHide(viewType);

    return response;
  };

  handleDeleteNoteClick = async (viewType, noteId) => {
    const { removeNote } = this.props;

    await removeNote({ variables: { noteId } });
    this.handleNoteHide(viewType);
  };

  render() {
    const {
      leadProfile: {
        loading,
        leadProfile,
      },
      pinnedNotes: { notes },
      location,
      match: { params, path, url },
    } = this.props;

    const { popover } = this.state;

    const lead = get(leadProfile, 'data') || {};
    const error = get(leadProfile, 'error');

    if (error) {
      return <NotFound />;
    }

    return (
      <div className="profile">
        <div className="profile__info">
          <Header
            data={lead}
            loading={loading}
            onPromoteLeadClick={this.triggerLeadModal}
            onAddNoteClick={this.handleAddNoteClick}
          />
          <HideDetails>
            <Information
              data={lead}
              loading={loading}
              pinnedNotes={get(notes, 'data') || {}}
              onEditNoteClick={this.handleEditNoteClick}
            />
          </HideDetails>
        </div>
        <Tabs
          items={leadProfileTabs}
          location={location}
          params={params}
        />
        <div className="card no-borders" >
          <Switch>
            <Route path={`${path}/profile`} component={Profile} />
            <Route disableScroll path={`${path}/notes`} component={Notes} />
            <Redirect to={`${url}/profile`} />
          </Switch>
        </div>
        {
          popover.name === NOTE_POPOVER &&
          <NotePopover
            isOpen
            manual
            toggle={() => this.handleNoteHide(noteViewType.POPOVER)}
            onAddSuccess={data => this.handleSubmitNoteClick(noteViewType.POPOVER, data)}
            onUpdateSuccess={data => this.handleSubmitNoteClick(noteViewType.POPOVER, data)}
            onDeleteSuccess={data => this.handleDeleteNoteClick(noteViewType.POPOVER, data)}
            {...popover.params}
          />
        }
      </div>
    );
  }
}

export default LeadProfile;
