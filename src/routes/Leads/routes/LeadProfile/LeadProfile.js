import React, { PureComponent, Suspense } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Switch, Redirect } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import NotFound from 'routes/NotFound';
import PropTypes from 'constants/propTypes';
import { aquisitionStatusesNames } from 'constants/aquisitionStatuses';
import { userTypes } from 'constants/hierarchyTypes';
import { viewType as noteViewType, targetTypes } from 'constants/note';
import NotePopover from 'components/NotePopover';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import HideDetails from 'components/HideDetails';
import NoteModal from 'components/NoteModal';
import PromoteLeadModal from 'components/PromoteLeadModal';
import RepresentativeUpdateModal from 'components/RepresentativeUpdateModal';
import { leadProfileTabs } from '../../constants';
import LeadProfileTab from './routes/LeadProfileTab';
import LeadNotesTab from './routes/LeadNotesTab';
import Information from './components/Information';
import Header from './components/Header';
import {
  NotesQuery,
  LeadProfileQuery,
  AddLeadProfileNote,
  RemoveLeadProfileNote,
  UpdateLeadProfileNote,
} from './graphql';

const NOTE_POPOVER = 'note-popover';

class LeadProfile extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    leadProfileQuery: PropTypes.query({
      leadProfile: PropTypes.response(PropTypes.lead),
    }).isRequired,
    pinnedNotesQuery: PropTypes.query({
      notes: PropTypes.response(PropTypes.object),
    }).isRequired,
    addNote: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired,
    removeNote: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      promoteLeadModal: PropTypes.modalType,
      representativeModal: PropTypes.modalType,
      noteModal: PropTypes.modalType,
    }).isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    notify: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    onEditModalNoteClick: PropTypes.func.isRequired,
    triggerRepresentativeUpdateModal: PropTypes.func.isRequired,
  };

  state = {
    popover: {
      name: null,
      params: {},
    },
  };

  getChildContext() {
    return {
      onEditModalNoteClick: this.handleEditModalNoteClick,
      triggerRepresentativeUpdateModal: this.triggerRepresentativeUpdateModal,
    };
  }

  triggerRepresentativeUpdateModal = () => {
    const {
      modals: { representativeModal },
      leadProfileQuery: { refetch, data },
      match: {
        params: { id },
      },
    } = this.props;

    const unassignFromOperator = get(data, 'leadProfile.data.salesAgent.uuid') || null;

    representativeModal.show({
      type: aquisitionStatusesNames.SALES,
      userType: userTypes.LEAD_CUSTOMER,
      leads: [
        {
          uuid: id,
          ...(unassignFromOperator && { unassignFromOperator }),
        },
      ],
      initialValues: { aquisitionStatus: aquisitionStatusesNames.SALES },
      header: I18n.t('LEAD_PROFILE.MODALS.REPRESENTATIVE_UPDATE.HEADER', {
        type: aquisitionStatusesNames.SALES.toLowerCase(),
      }),
      onSuccess: () => refetch(),
    });
  };

  triggerLeadModal = () => {
    const {
      leadProfileQuery,
      modals: { promoteLeadModal },
    } = this.props;

    promoteLeadModal.show({
      leadProfileQuery,
    });
  };

  handleEditModalNoteClick = (type, item) => () => {
    const { modals: { noteModal } } = this.props;
    const { content, subject, pinned } = item;

    noteModal.show({
      type,
      onEdit: data => this.handleSubmitNoteClick(noteViewType.MODAL, { ...item, ...data }),
      onDelete: () => this.handleDeleteNoteClick(noteViewType.MODAL, item.noteId),
      tagType: item.tagType,
      initialValues: {
        content,
        subject,
        pinned,
      },
    });
  };

  handleNoteHide = (type) => {
    const {
      modals: { noteModal },
    } = this.props;

    if (type === noteViewType.POPOVER) {
      this.setState({ popover: { name: null, params: {} } });
    } else {
      noteModal.hide();
    }
  };

  handleAddNoteClick = (target, params = {}) => {
    const {
      match: {
        params: { id: leadUUID },
      },
    } = this.props;

    this.setState({
      popover: {
        name: NOTE_POPOVER,
        params: {
          placement: 'bottom',
          ...params,
          target,
          targetType: targetTypes.LEAD,
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
      match: {
        params: { id: leadUUID },
      },
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
    await this.props.removeNote({ variables: { noteId } });

    this.handleNoteHide(viewType);
  };

  render() {
    const {
      leadProfileQuery: { loading: leadProfileLoading, data: leadProfile },
      pinnedNotesQuery: { data: pinnedNotes },
      location,
      match: { params, path, url },
    } = this.props;

    const { popover } = this.state;

    const leadProfileData = get(leadProfile, 'leadProfile.data') || {};
    const leadProfileError = get(leadProfile, 'leadProfile.error');

    const pinnedNotesData = get(pinnedNotes, 'notes.data') || {};

    if (leadProfileError) {
      return <NotFound />;
    }

    return (
      <div className="profile">
        <div className="profile__info">
          <Header
            data={leadProfileData}
            loading={leadProfileLoading}
            onPromoteLeadClick={this.triggerLeadModal}
            onAddNoteClick={this.handleAddNoteClick}
          />
          <HideDetails>
            <Information
              data={leadProfileData}
              loading={leadProfileLoading}
              pinnedNotes={pinnedNotesData}
              onEditNoteClick={this.handleEditNoteClick}
            />
          </HideDetails>
        </div>
        <Tabs items={leadProfileTabs} location={location} params={params} />
        <div className="card no-borders">
          <Suspense fallback={null}>
            <Switch>
              <Route path={`${path}/profile`} component={LeadProfileTab} />
              <Route disableScroll path={`${path}/notes`} component={LeadNotesTab} />
              <Redirect to={`${url}/profile`} />
            </Switch>
          </Suspense>
        </div>
        {popover.name === NOTE_POPOVER && (
          <NotePopover
            isOpen
            manual
            toggle={() => this.handleNoteHide(noteViewType.POPOVER)}
            onAddSuccess={data => this.handleSubmitNoteClick(noteViewType.POPOVER, data)}
            onUpdateSuccess={data => this.handleSubmitNoteClick(noteViewType.POPOVER, data)}
            onDeleteSuccess={data => this.handleDeleteNoteClick(noteViewType.POPOVER, data)}
            {...popover.params}
          />
        )}
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withModals({
    promoteLeadModal: PromoteLeadModal,
    noteModal: NoteModal,
    representativeModal: RepresentativeUpdateModal,
  }),
  withRequests({
    pinnedNotesQuery: NotesQuery,
    leadProfileQuery: LeadProfileQuery,
    addNote: AddLeadProfileNote,
    updateNote: UpdateLeadProfileNote,
    removeNote: RemoveLeadProfileNote,
  }),
)(LeadProfile);
